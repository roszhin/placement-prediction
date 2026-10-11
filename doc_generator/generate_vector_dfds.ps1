$ErrorActionPreference = "Stop"

$code = @"
using System;
using System.IO;
using System.Text;
using System.Globalization;
using System.Drawing;
using System.Drawing.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class VectorCanvas2 {
    public int Width;
    public int Height;
    private const double SvgScale = 0.5;
    private StringBuilder svg = new StringBuilder();
    private List<Action<IntPtr>> gdiCommands = new List<Action<IntPtr>>();
    private static Bitmap measureBmp = new Bitmap(16, 16);
    private static Graphics measureGraphics = Graphics.FromImage(measureBmp);

    static VectorCanvas2() {
        measureGraphics.TextRenderingHint = TextRenderingHint.AntiAlias;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
        public int X, Y;
        public POINT(int x, int y) { X = x; Y = y; }
    }

    [DllImport("gdi32.dll", CharSet = CharSet.Unicode)]
    public static extern IntPtr CreateEnhMetaFileW(IntPtr hdcRef, string lpFilename, ref RECT lpRect, string lpDescription);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CloseEnhMetaFile(IntPtr hdc);

    [DllImport("gdi32.dll")]
    public static extern bool DeleteEnhMetaFile(IntPtr hemf);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CreatePen(int fnPenStyle, int nWidth, uint crColor);

    [DllImport("gdi32.dll")]
    public static extern IntPtr CreateSolidBrush(uint crColor);

    [DllImport("gdi32.dll", CharSet = CharSet.Unicode)]
    public static extern IntPtr CreateFontW(int nHeight, int nWidth, int nEscapement, int nOrientation, int fnWeight, uint fdwItalic, uint fdwUnderline, uint fdwStrikeOut, uint fdwCharSet, uint fdwOutputPrecision, uint fdwClipPrecision, uint fdwQuality, uint fdwPitchAndFamily, string lpszFace);

    [DllImport("gdi32.dll")]
    public static extern IntPtr SelectObject(IntPtr hdc, IntPtr hgdiobj);

    [DllImport("gdi32.dll")]
    public static extern bool DeleteObject(IntPtr hObject);

    [DllImport("gdi32.dll")]
    public static extern int SetBkMode(IntPtr hdc, int iBkMode);

    [DllImport("gdi32.dll")]
    public static extern uint SetTextColor(IntPtr hdc, uint crColor);

    [DllImport("gdi32.dll")]
    public static extern uint SetTextAlign(IntPtr hdc, uint fMode);

    [DllImport("gdi32.dll")]
    public static extern bool Rectangle(IntPtr hdc, int nLeftRect, int nTopRect, int nRightRect, int nBottomRect);

    [DllImport("gdi32.dll")]
    public static extern bool RoundRect(IntPtr hdc, int nLeftRect, int nTopRect, int nRightRect, int nBottomRect, int nWidth, int nHeight);

    [DllImport("gdi32.dll")]
    public static extern bool Ellipse(IntPtr hdc, int nLeftRect, int nTopRect, int nRightRect, int nBottomRect);

    [DllImport("gdi32.dll")]
    public static extern bool Polygon(IntPtr hdc, POINT[] lpPoints, int nCount);

    [DllImport("gdi32.dll")]
    public static extern bool MoveToEx(IntPtr hdc, int X, int Y, IntPtr lpPoint);

    [DllImport("gdi32.dll")]
    public static extern bool LineTo(IntPtr hdc, int nXEnd, int nYEnd);

    [DllImport("gdi32.dll", CharSet = CharSet.Unicode)]
    public static extern bool ExtTextOutW(IntPtr hdc, int X, int Y, uint fuOptions, IntPtr lprc, string lpString, uint cbCount, IntPtr lpDx);

    [DllImport("user32.dll")]
    public static extern IntPtr GetDC(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);

    private const int PS_SOLID = 0;
    private const int TRANSPARENT = 1;
    private const uint TA_LEFT = 0;
    private const uint TA_BASELINE = 24;

    private static string S(double v) {
        return v.ToString("0.##", CultureInfo.InvariantCulture);
    }

    private static int G(double v) {
        return (int)Math.Round(v * SvgScale);
    }

    private static double MeasureTextWidth(string text, string fontFamily, int fontSize, bool bold) {
        if (string.IsNullOrEmpty(text)) return 0.0;
        FontStyle fs = bold ? FontStyle.Bold : FontStyle.Regular;
        using (Font f = new Font(fontFamily, (float)fontSize, fs, GraphicsUnit.Pixel)) {
            StringFormat sf = new StringFormat(StringFormat.GenericTypographic);
            sf.FormatFlags |= StringFormatFlags.MeasureTrailingSpaces;
            SizeF sz = measureGraphics.MeasureString(text, f, 4000, sf);
            return (double)sz.Width;
        }
    }

    public VectorCanvas2(int width, int height) {
        this.Width = width;
        this.Height = height;
        int physW = G(width);
        int physH = G(height);
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "<svg width=\"{0}\" height=\"{1}\" viewBox=\"0 0 {2} {3}\" xmlns=\"http://www.w3.org/2000/svg\">",
            physW, physH, width, height));
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <rect x=\"0\" y=\"0\" width=\"{0}\" height=\"{1}\" fill=\"#ffffff\"/>",
            width, height));

        gdiCommands.Add(hdc => {
            IntPtr whiteBrush = CreateSolidBrush(0x00FFFFFF);
            IntPtr nullPen = CreatePen(5, 0, 0x00FFFFFF);
            IntPtr oldPen = SelectObject(hdc, nullPen);
            IntPtr oldBrush = SelectObject(hdc, whiteBrush);
            Rectangle(hdc, 0, 0, physW + 1, physH + 1);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(nullPen);
            DeleteObject(whiteBrush);
        });
    }

    private static string Esc(string s) {
        return s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;");
    }

    public void AddHeading(int x, int y, string text, int fontSize = 22, string align = "middle", string fontFamily = "Times New Roman") {
        double w = MeasureTextWidth(text, fontFamily, fontSize, true);
        double leftX = (align == "middle") ? (x - w / 2.0) : (double)x;
        if (leftX < 1.0) leftX = 1.0;

        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <text x=\"{0}\" y=\"{1}\" font-family=\"{2}\" font-size=\"{3}\" font-weight=\"bold\" fill=\"#000000\">{4}</text>",
            S(leftX), S(y), fontFamily, fontSize, Esc(text)));

        int gFont = Math.Max(6, G(fontSize));
        double gw = MeasureTextWidth(text, fontFamily, gFont, true);
        int gdiX = (align == "middle") ? (int)Math.Round(G(x) - gw / 2.0) : G(x);
        int gdiY = G(y);
        gdiCommands.Add(hdc => {
            IntPtr font = CreateFontW(-gFont, 0, 0, 0, 700, 0, 0, 0, 1, 0, 0, 4, 0, fontFamily);
            IntPtr oldFont = SelectObject(hdc, font);
            SetBkMode(hdc, TRANSPARENT);
            SetTextColor(hdc, 0x00000000);
            SetTextAlign(hdc, TA_LEFT | TA_BASELINE);
            ExtTextOutW(hdc, gdiX, gdiY, 0, IntPtr.Zero, text, (uint)text.Length, IntPtr.Zero);
            SelectObject(hdc, oldFont);
            DeleteObject(font);
        });
    }

    public void AddTextLines(int x, int yFirstBaseline, string[] lines, int fontSize = 12, bool bold = false, string align = "middle", string fontFamily = "Arial", int lineStep = 15) {
        int gFont = Math.Max(5, G(fontSize));
        for (int i = 0; i < lines.Length; i++) {
            int ly = yFirstBaseline + i * lineStep;
            string lineText = lines[i];
            double w = MeasureTextWidth(lineText, fontFamily, fontSize, bold);
            double leftX = (align == "middle") ? (x - w / 2.0) : (double)x;
            if (leftX < 1.0) leftX = 1.0;

            string fw = bold ? " font-weight=\"bold\"" : "";
            svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
                "  <text x=\"{0}\" y=\"{1}\" font-family=\"{2}\" font-size=\"{3}\"{4} fill=\"#000000\">{5}</text>",
                S(leftX), S(ly), fontFamily, fontSize, fw, Esc(lineText)));

            double gw = MeasureTextWidth(lineText, fontFamily, gFont, bold);
            int capturedX = (align == "middle") ? (int)Math.Round(G(x) - gw / 2.0) : G(x);
            int capturedY = G(ly);
            string capturedLine = lineText;
            gdiCommands.Add(hdc => {
                IntPtr font = CreateFontW(-gFont, 0, 0, 0, bold ? 700 : 400, 0, 0, 0, 1, 0, 0, 4, 0, fontFamily);
                IntPtr oldFont = SelectObject(hdc, font);
                SetBkMode(hdc, TRANSPARENT);
                SetTextColor(hdc, 0x00000000);
                SetTextAlign(hdc, TA_LEFT | TA_BASELINE);
                ExtTextOutW(hdc, capturedX, capturedY, 0, IntPtr.Zero, capturedLine, (uint)capturedLine.Length, IntPtr.Zero);
                SelectObject(hdc, oldFont);
                DeleteObject(font);
            });
        }
    }

    private void AddCenteredBlockText(int cx, int cy, string[] lines, int fontSize, bool bold, string fontFamily = "Arial") {
        int lineStep = (int)Math.Round(fontSize * 1.28);
        int totalSpan = (lines.Length - 1) * lineStep;
        int firstY = cy - (totalSpan / 2) + (int)Math.Round(fontSize * 0.35);
        AddTextLines(cx, firstY, lines, fontSize, bold, "middle", fontFamily, lineStep);
    }

    public void AddRect(int x, int y, int w, int h, string[] lines, int fontSize = 14, bool bold = true, int strokeWidth = 2) {
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <rect x=\"{0}\" y=\"{1}\" width=\"{2}\" height=\"{3}\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"{4}\"/>",
            x, y, w, h, strokeWidth));

        int gx1 = G(x), gy1 = G(y), gx2 = G(x + w), gy2 = G(y + h), gsw = Math.Max(1, G(strokeWidth));
        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
            IntPtr brush = CreateSolidBrush(0x00FFFFFF);
            IntPtr oldPen = SelectObject(hdc, pen);
            IntPtr oldBrush = SelectObject(hdc, brush);
            Rectangle(hdc, gx1, gy1, gx2, gy2);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(pen);
            DeleteObject(brush);
        });

        if (lines != null && lines.Length > 0) {
            AddCenteredBlockText(x + w / 2, y + h / 2, lines, fontSize, bold);
        }
    }

    public void AddRoundRect(int x, int y, int w, int h, int rx, string[] lines, int fontSize = 13, bool bold = false, int strokeWidth = 2) {
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <rect x=\"{0}\" y=\"{1}\" width=\"{2}\" height=\"{3}\" rx=\"{4}\" ry=\"{4}\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"{5}\"/>",
            x, y, w, h, rx, strokeWidth));

        int gx1 = G(x), gy1 = G(y), gx2 = G(x + w), gy2 = G(y + h), grx = Math.Max(2, G(rx * 2)), gsw = Math.Max(1, G(strokeWidth));
        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
            IntPtr brush = CreateSolidBrush(0x00FFFFFF);
            IntPtr oldPen = SelectObject(hdc, pen);
            IntPtr oldBrush = SelectObject(hdc, brush);
            RoundRect(hdc, gx1, gy1, gx2, gy2, grx, grx);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(pen);
            DeleteObject(brush);
        });

        if (lines != null && lines.Length > 0) {
            AddCenteredBlockText(x + w / 2, y + h / 2, lines, fontSize, bold);
        }
    }

    public void AddOval(int cx, int cy, int rx, int ry, string[] lines, int fontSize = 13, bool bold = false, int strokeWidth = 2) {
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <ellipse cx=\"{0}\" cy=\"{1}\" rx=\"{2}\" ry=\"{3}\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"{4}\"/>",
            cx, cy, rx, ry, strokeWidth));

        int gx1 = G(cx - rx), gy1 = G(cy - ry), gx2 = G(cx + rx), gy2 = G(cy + ry), gsw = Math.Max(1, G(strokeWidth));
        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
            IntPtr brush = CreateSolidBrush(0x00FFFFFF);
            IntPtr oldPen = SelectObject(hdc, pen);
            IntPtr oldBrush = SelectObject(hdc, brush);
            Ellipse(hdc, gx1, gy1, gx2, gy2);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(pen);
            DeleteObject(brush);
        });

        if (lines != null && lines.Length > 0) {
            AddCenteredBlockText(cx, cy, lines, fontSize, bold);
        }
    }

    public void AddDiamond(int cx, int cy, int rx, int ry, string[] lines, int fontSize = 13, bool bold = false, int strokeWidth = 2) {
        int topX = cx, topY = cy - ry;
        int rightX = cx + rx, rightY = cy;
        int botX = cx, botY = cy + ry;
        int leftX = cx - rx, leftY = cy;

        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <path d=\"M {0} {1} L {2} {3} L {4} {5} L {6} {7} Z\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"{8}\"/>",
            topX, topY, rightX, rightY, botX, botY, leftX, leftY, strokeWidth));

        int gTopX = G(topX), gTopY = G(topY);
        int gRightX = G(rightX), gRightY = G(rightY);
        int gBotX = G(botX), gBotY = G(botY);
        int gLeftX = G(leftX), gLeftY = G(leftY);
        int gsw = Math.Max(1, G(strokeWidth));

        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
            IntPtr brush = CreateSolidBrush(0x00FFFFFF);
            IntPtr oldPen = SelectObject(hdc, pen);
            IntPtr oldBrush = SelectObject(hdc, brush);
            POINT[] pts = new POINT[] {
                new POINT(gTopX, gTopY),
                new POINT(gRightX, gRightY),
                new POINT(gBotX, gBotY),
                new POINT(gLeftX, gLeftY)
            };
            Polygon(hdc, pts, 4);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(pen);
            DeleteObject(brush);
        });

        if (lines != null && lines.Length > 0) {
            AddCenteredBlockText(cx, cy, lines, fontSize, bold);
        }
    }

    public void AddDataStore(int x, int y, int w, int h, string code, string label, int fontSize = 12, int strokeWidth = 2) {
        int codeW = Math.Max(36, (int)Math.Round(fontSize * 2.8));
        int splitX = x + codeW;
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <rect x=\"{0}\" y=\"{1}\" width=\"{2}\" height=\"{3}\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"{4}\"/>",
            x, y, w, h, strokeWidth));
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <line x1=\"{0}\" y1=\"{1}\" x2=\"{0}\" y2=\"{2}\" stroke=\"#000000\" stroke-width=\"{3}\"/>",
            splitX, y, y + h, strokeWidth));

        int gx1 = G(x), gy1 = G(y), gx2 = G(x + w), gy2 = G(y + h), gSplit = G(splitX), gsw = Math.Max(1, G(strokeWidth));
        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
            IntPtr brush = CreateSolidBrush(0x00FFFFFF);
            IntPtr oldPen = SelectObject(hdc, pen);
            IntPtr oldBrush = SelectObject(hdc, brush);
            Rectangle(hdc, gx1, gy1, gx2, gy2);
            MoveToEx(hdc, gSplit, gy1, IntPtr.Zero);
            LineTo(hdc, gSplit, gy2);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(pen);
            DeleteObject(brush);
        });

        AddCenteredBlockText(x + codeW / 2, y + h / 2, new string[] { code }, fontSize, true);
        AddCenteredBlockText(splitX + (w - codeW) / 2, y + h / 2, new string[] { label }, fontSize, false);
    }

    private void DrawArrowHead(int xFrom, int yFrom, int xTip, int yTip) {
        double dx = xTip - xFrom;
        double dy = yTip - yFrom;
        double len = Math.Sqrt(dx * dx + dy * dy);
        if (len < 1.0) return;
        double ux = dx / len;
        double uy = dy / len;
        double px = -uy;
        double py = ux;

        double arrowLen = 9.0;
        double arrowHalfW = 4.5;

        int bx = (int)Math.Round(xTip - ux * arrowLen);
        int by = (int)Math.Round(yTip - uy * arrowLen);

        int p1x = (int)Math.Round(bx + px * arrowHalfW);
        int p1y = (int)Math.Round(by + py * arrowHalfW);
        int p2x = (int)Math.Round(bx - px * arrowHalfW);
        int p2y = (int)Math.Round(by - py * arrowHalfW);

        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <path d=\"M {0} {1} L {2} {3} L {4} {5} Z\" fill=\"#000000\"/>",
            xTip, yTip, p1x, p1y, p2x, p2y));

        int gxTip = G(xTip), gyTip = G(yTip), gp1x = G(p1x), gp1y = G(p1y), gp2x = G(p2x), gp2y = G(p2y);
        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, 1, 0x00000000);
            IntPtr brush = CreateSolidBrush(0x00000000);
            IntPtr oldPen = SelectObject(hdc, pen);
            IntPtr oldBrush = SelectObject(hdc, brush);
            POINT[] pts = new POINT[] {
                new POINT(gxTip, gyTip),
                new POINT(gp1x, gp1y),
                new POINT(gp2x, gp2y)
            };
            Polygon(hdc, pts, 3);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(pen);
            DeleteObject(brush);
        });
    }

    public void AddOrthoArrow(int[] coords, string[] labelLines = null, int labelX = 0, int labelY = 0, int fontSize = 11, bool startArrow = false, bool endArrow = true, int strokeWidth = 2) {
        int n = coords.Length / 2;
        if (n < 2) return;

        POINT[] pts = new POINT[n];
        for (int i = 0; i < n; i++) {
            pts[i] = new POINT(coords[i * 2], coords[i * 2 + 1]);
        }

        // Emit each segment with non-negative delta (x1 <= x2, y1 <= y2) so Office/Word never marks any line as flipped
        for (int i = 0; i < n - 1; i++) {
            int x1 = Math.Min(pts[i].X, pts[i + 1].X);
            int y1 = Math.Min(pts[i].Y, pts[i + 1].Y);
            int x2 = Math.Max(pts[i].X, pts[i + 1].X);
            int y2 = Math.Max(pts[i].Y, pts[i + 1].Y);

            svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
                "  <line x1=\"{0}\" y1=\"{1}\" x2=\"{2}\" y2=\"{3}\" stroke=\"#000000\" stroke-width=\"{4}\"/>",
                x1, y1, x2, y2, strokeWidth));

            int cx1 = G(x1), cy1 = G(y1), cx2 = G(x2), cy2 = G(y2), gsw = Math.Max(1, G(strokeWidth));
            gdiCommands.Add(hdc => {
                IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
                IntPtr oldPen = SelectObject(hdc, pen);
                MoveToEx(hdc, cx1, cy1, IntPtr.Zero);
                LineTo(hdc, cx2, cy2);
                SelectObject(hdc, oldPen);
                DeleteObject(pen);
            });
        }

        if (endArrow) {
            DrawArrowHead(pts[n - 2].X, pts[n - 2].Y, pts[n - 1].X, pts[n - 1].Y);
        }
        if (startArrow) {
            DrawArrowHead(pts[1].X, pts[1].Y, pts[0].X, pts[0].Y);
        }

        if (labelLines != null && labelLines.Length > 0) {
            AddTextLines(labelX, labelY, labelLines, fontSize, false, "middle", "Arial", (int)Math.Round(fontSize * 1.25));
        }
    }

    public void DrawPathLine(int x1, int y1, int x2, int y2, int strokeWidth = 2) {
        svg.AppendLine(string.Format(CultureInfo.InvariantCulture,
            "  <path d=\"M {0} {1} L {2} {3}\" fill=\"none\" stroke=\"#000000\" stroke-width=\"{4}\"/>",
            x1, y1, x2, y2, strokeWidth));

        int cx1 = G(x1), cy1 = G(y1), cx2 = G(x2), cy2 = G(y2), gsw = Math.Max(1, G(strokeWidth));
        gdiCommands.Add(hdc => {
            IntPtr pen = CreatePen(PS_SOLID, gsw, 0x00000000);
            IntPtr oldPen = SelectObject(hdc, pen);
            MoveToEx(hdc, cx1, cy1, IntPtr.Zero);
            LineTo(hdc, cx2, cy2);
            SelectObject(hdc, oldPen);
            DeleteObject(pen);
        });
    }

    public void AddSpokeOval(int entCx, int entCy, int entW, int entH, int ovalCx, int ovalCy, int rx, int ry, string label, int fontSize = 10) {
        double dx = ovalCx - entCx;
        double dy = ovalCy - entCy;
        double tx = Math.Abs(dx) > 0.001 ? (entW / 2.0) / Math.Abs(dx) : 1000.0;
        double ty = Math.Abs(dy) > 0.001 ? (entH / 2.0) / Math.Abs(dy) : 1000.0;
        double tRect = Math.Min(tx, ty);

        int x1 = (int)Math.Round(entCx + dx * tRect);
        int y1 = (int)Math.Round(entCy + dy * tRect);

        double denom = Math.Sqrt((dx * dx) / (double)(rx * rx) + (dy * dy) / (double)(ry * ry));
        double tOval = denom > 0.001 ? (1.0 / denom) : 0.0;

        int x2 = (int)Math.Round(ovalCx - dx * tOval);
        int y2 = (int)Math.Round(ovalCy - dy * tOval);

        DrawPathLine(x1, y1, x2, y2, 2);
        AddOval(ovalCx, ovalCy, rx, ry, new string[] { label }, fontSize, false, 2);
    }

    private void DrawCardinalitySymbol(int xFrom, int yFrom, int xEnt, int yEnt, string cardType, int strokeWidth = 2) {
        if (string.IsNullOrEmpty(cardType)) return;
        double dx = xEnt - xFrom;
        double dy = yEnt - yFrom;
        double len = Math.Sqrt(dx * dx + dy * dy);
        if (len < 1.0) return;
        double ux = dx / len;
        double uy = dy / len;
        double px = -uy;
        double py = ux;

        if (cardType == "1") {
            double tx = xEnt - ux * 11.0;
            double ty = yEnt - uy * 11.0;
            DrawPathLine(
                (int)Math.Round(tx - px * 8.5), (int)Math.Round(ty - py * 8.5),
                (int)Math.Round(tx + px * 8.5), (int)Math.Round(ty + py * 8.5),
                strokeWidth);
        } else if (cardType == "M") {
            int bx = (int)Math.Round(xEnt - ux * 15.0);
            int by = (int)Math.Round(yEnt - uy * 15.0);
            DrawPathLine(bx, by, (int)Math.Round(xEnt + px * 8.5), (int)Math.Round(yEnt + py * 8.5), strokeWidth);
            DrawPathLine(bx, by, (int)Math.Round(xEnt - px * 8.5), (int)Math.Round(yEnt - py * 8.5), strokeWidth);
            DrawPathLine(
                (int)Math.Round(bx - px * 7.5), (int)Math.Round(by - py * 7.5),
                (int)Math.Round(bx + px * 7.5), (int)Math.Round(by + py * 7.5),
                strokeWidth);
        }
    }

    public void AddErConnector(int[] coords, string startCard = "", string endCard = "", int strokeWidth = 2) {
        int n = coords.Length / 2;
        if (n < 2) return;
        POINT[] pts = new POINT[n];
        for (int i = 0; i < n; i++) {
            pts[i] = new POINT(coords[i * 2], coords[i * 2 + 1]);
        }
        for (int i = 0; i < n - 1; i++) {
            DrawPathLine(pts[i].X, pts[i].Y, pts[i + 1].X, pts[i + 1].Y, strokeWidth);
        }
        if (!string.IsNullOrEmpty(startCard)) {
            DrawCardinalitySymbol(pts[1].X, pts[1].Y, pts[0].X, pts[0].Y, startCard, strokeWidth);
        }
        if (!string.IsNullOrEmpty(endCard)) {
            DrawCardinalitySymbol(pts[n - 2].X, pts[n - 2].Y, pts[n - 1].X, pts[n - 1].Y, endCard, strokeWidth);
        }
    }

    public void AddErLegend(int x, int y) {
        AddRect(x, y, 44, 24, null, 15, false, 2);
        AddTextLines(x + 56, y + 17, new string[] { "Rectangle = Entity" }, 15, false, "start", "Arial", 18);

        AddOval(x + 22, y + 48, 22, 12, null, 15, false, 2);
        AddTextLines(x + 56, y + 53, new string[] { "Ellipse = Attribute" }, 15, false, "start", "Arial", 18);

        AddDiamond(x + 22, y + 84, 22, 13, null, 15, false, 2);
        AddTextLines(x + 56, y + 89, new string[] { "Diamond = Relationship" }, 15, false, "start", "Arial", 18);
    }

    public void SaveSvg(string path) {
        string content = svg.ToString() + "</svg>\n";
        File.WriteAllText(path, content, new UTF8Encoding(false));
    }

    public void SaveEmf(string path) {
        if (File.Exists(path)) File.Delete(path);
        IntPtr screenDC = GetDC(IntPtr.Zero);

        int physW = G(Width);
        int physH = G(Height);
        int frameW = (int)Math.Round(physW * 25400.0 / 960.0);
        int frameH = (int)Math.Round(physH * 25400.0 / 960.0);

        RECT rc = new RECT { Left = 0, Top = 0, Right = frameW, Bottom = frameH };
        IntPtr hdc = CreateEnhMetaFileW(screenDC, path, ref rc, "ROSHIN AI\0DFD Vector Diagram\0\0");
        ReleaseDC(IntPtr.Zero, screenDC);

        if (hdc == IntPtr.Zero) {
            throw new Exception("Failed to create EMF handle for " + path);
        }

        foreach (var cmd in gdiCommands) {
            cmd(hdc);
        }

        IntPtr hemf = CloseEnhMetaFile(hdc);
        if (hemf != IntPtr.Zero) {
            DeleteEnhMetaFile(hemf);
        }

        // Normalize EMF header to exact 96 DPI (960px = 254mm) in pure MM_TEXT so Bounds (550x230) and Frame (14552x6085) match 1:1 (412.5pt x 172.5pt)
        byte[] bytes = File.ReadAllBytes(path);
        Array.Copy(BitConverter.GetBytes(frameW), 0, bytes, 32, 4);
        Array.Copy(BitConverter.GetBytes(frameH), 0, bytes, 36, 4);
        Array.Copy(BitConverter.GetBytes(960), 0, bytes, 72, 4);
        Array.Copy(BitConverter.GetBytes(540), 0, bytes, 76, 4);
        Array.Copy(BitConverter.GetBytes(254), 0, bytes, 80, 4);
        Array.Copy(BitConverter.GetBytes(143), 0, bytes, 84, 4);
        File.WriteAllBytes(path, bytes);
    }
}
"@

Add-Type -TypeDefinition $code -Language CSharp -ReferencedAssemblies System.Drawing

function Build-Level0([VectorCanvas2]$c, [int]$yOff, [bool]$includeSectionHeader) {
    if ($includeSectionHeader) {
        $c.AddHeading(60, $yOff + 34, "5.2 Data Flow diagram:", 24, "start", "Times New Roman")
        $yOff += 38
    }
    $c.AddHeading(460, $yOff + 36, "Level - 0", 26, "middle", "Times New Roman")

    # Central Process Oval
    $c.AddOval(460, $yOff + 255, 160, 112, @(
        "AI Integrated Placement",
        "Prediction and Skill Gap",
        "Analyzer",
        "(ROSHIN AI)"
    ), 16, $true, 2)

    # 4 External Entities (Rectangles)
    $c.AddRect(25, $yOff + 85, 135, 72, @("Student"), 19, $true, 2)
    $c.AddRect(760, $yOff + 85, 135, 72, @("Company"), 19, $true, 2)
    $c.AddRect(25, $yOff + 335, 135, 72, @("Faculty"), 19, $true, 2)
    $c.AddRect(760, $yOff + 335, 135, 72, @("Admin"), 19, $true, 2)

    # 1. Student -> System
    $c.AddOrthoArrow(@(160, ($yOff + 110), 392, ($yOff + 110), 392, ($yOff + 153)), @(
        "Profile, Resume &",
        "Job Application"
    ), 276, $yOff + 80, 15, $false, $true, 2)

    # 2. System -> Student
    $c.AddOrthoArrow(@(308, ($yOff + 205), 92, ($yOff + 205), 92, ($yOff + 157)), @(
        "Job Details, Skill Gap",
        "& Recommendations"
    ), 196, $yOff + 225, 15, $false, $true, 2)

    # 3. Company -> System
    $c.AddOrthoArrow(@(760, ($yOff + 110), 528, ($yOff + 110), 528, ($yOff + 153)), @(
        "Job Data &",
        "Applicant Decisions"
    ), 644, $yOff + 80, 15, $false, $true, 2)

    # 4. System -> Company
    $c.AddOrthoArrow(@(612, ($yOff + 205), 828, ($yOff + 205), 828, ($yOff + 157)), @(
        "Applications &",
        "Resume Data"
    ), 724, $yOff + 225, 15, $false, $true, 2)

    # 5. System -> Faculty
    $c.AddOrthoArrow(@(308, ($yOff + 305), 92, ($yOff + 305), 92, ($yOff + 335)), @(
        "Student & Placement",
        "Reports"
    ), 196, $yOff + 274, 15, $false, $true, 2)

    # 6. Faculty -> System
    $c.AddOrthoArrow(@(160, ($yOff + 390), 392, ($yOff + 390), 392, ($yOff + 357)), @(
        "Placement Requests"
    ), 276, $yOff + 412, 15, $false, $true, 2)

    # 7. System -> Admin
    $c.AddOrthoArrow(@(612, ($yOff + 305), 828, ($yOff + 305), 828, ($yOff + 335)), @(
        "Users, Jobs &",
        "Application Data"
    ), 724, $yOff + 274, 15, $false, $true, 2)

    # 8. Admin -> System
    $c.AddOrthoArrow(@(760, ($yOff + 390), 528, ($yOff + 390), 528, ($yOff + 357)), @(
        "User & Job",
        "Management"
    ), 644, $yOff + 410, 15, $false, $true, 2)
}

function Build-Level1([VectorCanvas2]$c, [int]$yOff) {
    $c.AddHeading(460, $yOff + 34, "Level-1", 26, "middle", "Times New Roman")

    # External Entities (Left & Right)
    $c.AddRect(18, $yOff + 278, 106, 60, @("Student"), 17, $true, 2)
    $c.AddRect(808, $yOff + 178, 100, 56, @("Company"), 16, $true, 2)
    $c.AddRect(808, $yOff + 492, 100, 50, @("Faculty"), 16, $true, 2)
    $c.AddRect(808, $yOff + 572, 100, 50, @("Admin"), 16, $true, 2)

    # 7 Major Processes (Ovals)
    # Left-Middle Column (cx = 280)
    $c.AddOval(280, $yOff + 105, 88, 42, @(
        "1.0",
        "User & Profile",
        "Management"
    ), 14, $true, 2)

    $c.AddOval(280, $yOff + 226, 88, 42, @(
        "2.0",
        "Resume & Skill",
        "Management"
    ), 14, $true, 2)

    $c.AddOval(280, $yOff + 408, 88, 42, @(
        "5.0",
        "AI Placement",
        "Analysis"
    ), 14, $true, 2)

    $c.AddOval(280, $yOff + 560, 88, 42, @(
        "6.0",
        "Skill Gap &",
        "Recommendations"
    ), 14, $true, 2)

    # Right-Middle Column (cx = 640)
    $c.AddOval(640, $yOff + 105, 85, 42, @(
        "3.0",
        "Job Management"
    ), 14, $true, 2)

    $c.AddOval(640, $yOff + 310, 88, 42, @(
        "4.0",
        "Job Application",
        "Management"
    ), 14, $true, 2)

    $c.AddOval(640, $yOff + 560, 88, 44, @(
        "7.0",
        "Placement Monitoring",
        "& Reports"
    ), 14, $true, 2)

    # 7 Major Data Stores (D1..D7)
    $c.AddDataStore(405, $yOff + 58, 132, 34, "D1", "Users", 14, 2)
    $c.AddDataStore(405, $yOff + 104, 132, 34, "D2", "Students", 14, 2)
    $c.AddDataStore(405, $yOff + 150, 142, 34, "D3", "Companies", 14, 2)
    $c.AddDataStore(405, $yOff + 209, 136, 34, "D5", "Resumes", 14, 2)
    $c.AddDataStore(405, $yOff + 391, 142, 34, "D7", "AI Analysis", 14, 2)
    $c.AddDataStore(575, $yOff + 195, 130, 34, "D4", "Jobs", 14, 2)
    $c.AddDataStore(567, $yOff + 418, 148, 34, "D6", "Applications", 14, 2)

    # Data Flows (Left & Center)
    # 1. Student -> 1.0
    $c.AddOrthoArrow(@(52, ($yOff + 278), 52, ($yOff + 105), 192, ($yOff + 105)), @(
        "Login & Profile"
    ), 122, $yOff + 92, 14, $false, $true, 2)

    # 2. Student -> 2.0
    $c.AddOrthoArrow(@(92, ($yOff + 278), 92, ($yOff + 226), 192, ($yOff + 226)), @(
        "Resume & Skills"
    ), 140, $yOff + 212, 14, $false, $true, 2)

    # 3. 1.0 <-> D1, D2 & 3.0 <-> D3
    $c.AddOrthoArrow(@(353, ($yOff + 80), 405, ($yOff + 80)), @(), 0, 0, 14, $true, $true, 2)
    $c.AddOrthoArrow(@(361, ($yOff + 121), 405, ($yOff + 121)), @(), 0, 0, 14, $true, $true, 2)
    $c.AddOrthoArrow(@(547, ($yOff + 167), 584, ($yOff + 167), 584, ($yOff + 136)), @(), 0, 0, 14, $true, $true, 2)

    # 4. 2.0 <-> D5 Resumes
    $c.AddOrthoArrow(@(368, ($yOff + 226), 405, ($yOff + 226)), @(), 0, 0, 14, $true, $true, 2)

    # 5. Student <-> 4.0 (Open horizontal corridor)
    $c.AddOrthoArrow(@(124, ($yOff + 298), 552, ($yOff + 298)), @(
        "Job Application"
    ), 445, $yOff + 285, 14, $false, $true, 2)

    $c.AddOrthoArrow(@(552, ($yOff + 322), 124, ($yOff + 322)), @(
        "Application Status"
    ), 445, $yOff + 340, 14, $false, $true, 2)

    # 6. Student -> 5.0 (label below horizontal segment so it has 100% clear space)
    $c.AddOrthoArrow(@(92, ($yOff + 338), 92, ($yOff + 408), 192, ($yOff + 408)), @(
        "Analysis Request"
    ), 136, $yOff + 427, 14, $false, $true, 2)

    # 7. 5.0 <-> D7 AI Analysis
    $c.AddOrthoArrow(@(368, ($yOff + 408), 405, ($yOff + 408)), @(), 0, 0, 14, $true, $true, 2)

    # 8. 5.0 -> 6.0
    $c.AddOrthoArrow(@(280, ($yOff + 450), 280, ($yOff + 518)), @(
        "Analysis Result"
    ), 342, $yOff + 488, 14, $false, $true, 2)

    # 9. 6.0 -> Student
    $c.AddOrthoArrow(@(192, ($yOff + 560), 52, ($yOff + 560), 52, ($yOff + 338)), @(
        "Skill Gap &",
        "Recommendations"
    ), 122, $yOff + 578, 14, $false, $true, 2)

    # Data Flows (Right Column)
    # 10. Company -> 3.0
    $c.AddOrthoArrow(@(858, ($yOff + 178), 858, ($yOff + 105), 725, ($yOff + 105)), @(
        "Job Data"
    ), 792, $yOff + 92, 14, $false, $true, 2)

    # 11. 3.0 -> D4 Jobs -> 4.0
    $c.AddOrthoArrow(@(640, ($yOff + 147), 640, ($yOff + 195)), @(
        "Save Job"
    ), 680, $yOff + 175, 14, $false, $true, 2)

    $c.AddOrthoArrow(@(640, ($yOff + 229), 640, ($yOff + 268)), @(
        "Job Details"
    ), 688, $yOff + 253, 14, $false, $true, 2)

    # 12. Company <-> 4.0
    $c.AddOrthoArrow(@(858, ($yOff + 234), 858, ($yOff + 310), 728, ($yOff + 310)), @(
        "Applicant",
        "Action"
    ), 796, $yOff + 328, 14, $true, $true, 2)

    # 13. 4.0 <-> D6 Applications -> 7.0
    $c.AddOrthoArrow(@(640, ($yOff + 352), 640, ($yOff + 418)), @(
        "Applications"
    ), 690, $yOff + 388, 14, $true, $true, 2)

    $c.AddOrthoArrow(@(640, ($yOff + 452), 640, ($yOff + 516)), @(
        "Placement Data"
    ), 698, $yOff + 488, 14, $false, $true, 2)

    # 14. 7.0 <-> Faculty & Admin
    $c.AddOrthoArrow(@(708, ($yOff + 532), 808, ($yOff + 532)), @(
        "Reports"
    ), 762, $yOff + 519, 14, $true, $true, 2)

    $c.AddOrthoArrow(@(708, ($yOff + 588), 808, ($yOff + 588)), @(
        "Monitoring"
    ), 762, $yOff + 606, 14, $true, $true, 2)
}

function Build-Level2([VectorCanvas2]$c, [int]$yOff) {
    $c.AddHeading(460, $yOff + 34, "Level-2", 26, "middle", "Times New Roman")
    $c.AddTextLines(460, $yOff + 58, @("AI Placement Analysis & Skill Gap Analysis"), 16, $true, "middle", "Times New Roman", 20)

    # Row 1 (Left -> Right): y center = yOff + 120
    $r1Y = $yOff + 120
    $c.AddRect(35, $r1Y - 30, 190, 60, @("Student"), 18, $true, 2)
    $c.AddRoundRect(365, $r1Y - 32, 190, 64, 14, @("Resume Processing"), 15, $true, 2)
    $c.AddRoundRect(695, $r1Y - 32, 190, 64, 14, @("Skill Extraction"), 15, $true, 2)

    # Data Store D5: Resumes below Resume Processing
    $c.AddDataStore(385, $yOff + 178, 150, 36, "D5", "Resumes", 14, 2)
    $c.AddOrthoArrow(@(460, ($yOff + 178), 460, ($r1Y + 32)), @("Resume PDF"), 512, $yOff + 170, 13, $false, $true, 2)

    # Arrows Row 1 (140px gap: 225..365 and 555..695)
    $c.AddOrthoArrow(@(225, $r1Y, 365, $r1Y), @("Current Resume"), 295, $r1Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(555, $r1Y, 695, $r1Y), @("Resume Text"), 625, $r1Y - 14, 14, $false, $true, 2)

    # Row 2 (Right -> Left): y center = yOff + 280
    $r2Y = $yOff + 280
    $c.AddOrthoArrow(@(790, ($r1Y + 32), 790, ($r2Y - 32)), @("Candidate Skills"), 722, $yOff + 204, 14, $false, $true, 2)

    $c.AddRoundRect(695, $r2Y - 32, 190, 64, 14, @("Job Matching"), 15, $true, 2)
    $c.AddOval(460, $r2Y, 95, 36, @("AI Analysis"), 16, $true, 2)
    $c.AddRoundRect(35, $r2Y - 32, 190, 64, 14, @("Score & Skill Gap"), 15, $true, 2)

    # Data Stores D4: Jobs (below Job Matching) & D7: AI Analysis (below AI Analysis)
    $c.AddDataStore(720, $yOff + 336, 140, 36, "D4", "Jobs", 14, 2)
    $c.AddOrthoArrow(@(790, ($yOff + 336), 790, ($r2Y + 32)), @("Job Criteria"), 840, $yOff + 328, 13, $false, $true, 2)

    $c.AddDataStore(382, $yOff + 336, 155, 36, "D7", "AI Analysis", 14, 2)
    $c.AddOrthoArrow(@(460, ($r2Y + 36), 460, ($yOff + 336)), @("Save Score"), 510, $yOff + 328, 13, $false, $true, 2)

    # Arrows Row 2
    $c.AddOrthoArrow(@(695, $r2Y, 555, $r2Y), @("Job Requirements"), 625, $r2Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(365, $r2Y, 225, $r2Y), @("Eligibility & Match"), 295, $r2Y - 14, 14, $false, $true, 2)

    # Row 3 (Left -> Right): y center = yOff + 430
    $r3Y = $yOff + 430
    $c.AddOrthoArrow(@(130, ($r2Y + 32), 130, ($r3Y - 32)), @("Skill Gap"), 176, $yOff + 360, 14, $false, $true, 2)

    $c.AddRoundRect(35, $r3Y - 32, 190, 64, 14, @("Recommendations"), 15, $true, 2)
    $c.AddRoundRect(365, $r3Y - 32, 190, 64, 14, @("Analysis Result"), 15, $true, 2)
    $c.AddRect(695, $r3Y - 30, 190, 60, @("Student"), 18, $true, 2)

    # Arrows Row 3
    $c.AddOrthoArrow(@(225, $r3Y, 365, $r3Y), @("Learning Advice"), 295, $r3Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(555, $r3Y, 695, $r3Y), @("Score & Skill Gap"), 625, $r3Y - 14, 14, $false, $true, 2)
}

function Build-Level3([VectorCanvas2]$c, [int]$yOff) {
    $c.AddHeading(460, $yOff + 34, "Level-3", 26, "middle", "Times New Roman")
    $c.AddTextLines(460, $yOff + 58, @("Job Application Process"), 16, $true, "middle", "Times New Roman", 20)

    # Row 1 (Left -> Right): y center = yOff + 120
    $r1Y = $yOff + 120
    $c.AddRect(35, $r1Y - 30, 190, 60, @("Student"), 18, $true, 2)
    $c.AddRoundRect(365, $r1Y - 32, 190, 64, 14, @("Browse Jobs"), 15, $true, 2)
    $c.AddRoundRect(695, $r1Y - 32, 190, 64, 14, @("View Job & Apply"), 15, $true, 2)

    # Data Store D4: Jobs below Browse Jobs
    $c.AddDataStore(390, $yOff + 178, 140, 36, "D4", "Jobs", 14, 2)
    $c.AddOrthoArrow(@(460, ($yOff + 178), 460, ($r1Y + 32)), @("Active Jobs"), 512, $yOff + 170, 13, $false, $true, 2)

    # Arrows Row 1 (140px gap: 225..365 and 555..695)
    $c.AddOrthoArrow(@(225, $r1Y, 365, $r1Y), @("Job Search"), 295, $r1Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(555, $r1Y, 695, $r1Y), @("Job Details"), 625, $r1Y - 14, 14, $false, $true, 2)

    # Row 2 (Right -> Left): y center = yOff + 280
    $r2Y = $yOff + 280
    $c.AddOrthoArrow(@(790, ($r1Y + 32), 790, ($r2Y - 32)), @("Application"), 735, $yOff + 204, 14, $false, $true, 2)

    $c.AddRoundRect(695, $r2Y - 32, 190, 64, 14, @("Validate Application"), 15, $true, 2)
    $c.AddRoundRect(365, $r2Y - 32, 190, 64, 14, @("Store Application"), 15, $true, 2)
    $c.AddRoundRect(35, $r2Y - 32, 190, 64, 14, @("Company Reviews"), 15, $true, 2)

    # External Entity Company above Company Reviews & D6: Applications below Store Application
    $c.AddRect(60, $yOff + 174, 140, 44, @("Company"), 16, $true, 2)
    $c.AddOrthoArrow(@(130, ($yOff + 218), 130, ($r2Y - 32)), @("Review"), 168, $yOff + 236, 13, $true, $true, 2)

    $c.AddDataStore(380, $yOff + 336, 160, 36, "D6", "Applications", 14, 2)
    $c.AddOrthoArrow(@(460, ($r2Y + 32), 460, ($yOff + 336)), @("Save"), 495, $yOff + 328, 13, $false, $true, 2)

    # Arrows Row 2
    $c.AddOrthoArrow(@(695, $r2Y, 555, $r2Y), @("Validation"), 625, $r2Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(365, $r2Y, 225, $r2Y), @("Applicant Review"), 295, $r2Y - 14, 14, $false, $true, 2)

    # Row 3 (Left -> Right): y center = yOff + 430
    $r3Y = $yOff + 430
    $c.AddOrthoArrow(@(130, ($r2Y + 32), 130, ($r3Y - 32)), @("Selection Decision"), 202, $yOff + 360, 14, $false, $true, 2)

    $c.AddRoundRect(35, $r3Y - 32, 190, 64, 14, @("Update Status"), 15, $true, 2)
    $c.AddRoundRect(365, $r3Y - 32, 190, 64, 14, @("Application Status"), 15, $true, 2)
    $c.AddRect(695, $r3Y - 30, 190, 60, @("Student"), 18, $true, 2)

    # Arrows Row 3
    $c.AddOrthoArrow(@(225, $r3Y, 365, $r3Y), @("Status Update"), 295, $r3Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(555, $r3Y, 695, $r3Y), @("Updated Status"), 625, $r3Y - 14, 14, $false, $true, 2)
}

function Build-Level3Resume([VectorCanvas2]$c, [int]$yOff) {
    $c.AddHeading(460, $yOff + 34, "Level-3", 26, "middle", "Times New Roman")
    $c.AddTextLines(460, $yOff + 58, @("Resume Analysis Workflow"), 16, $true, "middle", "Times New Roman", 20)

    # Row 1 (Left -> Right): y center = yOff + 120
    $r1Y = $yOff + 120
    $c.AddRect(35, $r1Y - 30, 190, 60, @("Student"), 18, $true, 2)
    $c.AddRoundRect(365, $r1Y - 32, 190, 64, 14, @("Resume Upload"), 15, $true, 2)
    $c.AddRoundRect(695, $r1Y - 32, 190, 64, 14, @("Text Extraction"), 15, $true, 2)

    # Data Store D5: Resumes below Resume Upload
    $c.AddDataStore(385, $yOff + 178, 150, 36, "D5", "Resumes", 14, 2)
    $c.AddOrthoArrow(@(460, ($r1Y + 32), 460, ($yOff + 178)), @("Store PDF"), 505, $yOff + 170, 13, $false, $true, 2)

    # Arrows Row 1 (140px gap: 225..365 and 555..695)
    $c.AddOrthoArrow(@(225, $r1Y, 365, $r1Y), @("PDF File"), 295, $r1Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(555, $r1Y, 695, $r1Y), @("Active Resume"), 625, $r1Y - 14, 14, $false, $true, 2)

    # Row 2 (Right -> Left): y center = yOff + 280
    $r2Y = $yOff + 280
    $c.AddOrthoArrow(@(790, ($r1Y + 32), 790, ($r2Y - 32)), @("Extracted Text"), 726, $yOff + 204, 14, $false, $true, 2)

    $c.AddRoundRect(695, $r2Y - 32, 190, 64, 14, @("Skill Extraction"), 15, $true, 2)
    $c.AddRoundRect(365, $r2Y - 32, 190, 64, 14, @("Job Comparison"), 15, $true, 2)
    $c.AddOval(130, $r2Y, 95, 36, @("AI Analysis"), 16, $true, 2)

    # Data Store D4: Jobs below Job Comparison
    $c.AddDataStore(390, $yOff + 336, 140, 36, "D4", "Jobs", 14, 2)
    $c.AddOrthoArrow(@(460, ($yOff + 336), 460, ($r2Y + 32)), @("Job Skills"), 505, $yOff + 328, 13, $false, $true, 2)

    # Arrows Row 2
    $c.AddOrthoArrow(@(695, $r2Y, 555, $r2Y), @("Candidate Skills"), 625, $r2Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(365, $r2Y, 225, $r2Y), @("Skill Match"), 295, $r2Y - 14, 14, $false, $true, 2)

    # Row 3 (Left -> Right): y center = yOff + 430
    $r3Y = $yOff + 430
    $c.AddOrthoArrow(@(130, ($r2Y + 36), 130, ($r3Y - 32)), @("AI Evaluation"), 188, $yOff + 360, 14, $false, $true, 2)

    $c.AddRoundRect(35, $r3Y - 32, 190, 64, 14, @("Score & Skill Gap"), 15, $true, 2)
    $c.AddRoundRect(365, $r3Y - 32, 190, 64, 14, @("Recommendation"), 15, $true, 2)
    $c.AddRect(695, $r3Y - 30, 190, 60, @("Student"), 18, $true, 2)

    # Arrows Row 3
    $c.AddOrthoArrow(@(225, $r3Y, 365, $r3Y), @("Skill Gap"), 295, $r3Y - 14, 14, $false, $true, 2)
    $c.AddOrthoArrow(@(555, $r3Y, 695, $r3Y), @("Final Report"), 625, $r3Y - 14, 14, $false, $true, 2)
}

function Build-MainFlowchart([VectorCanvas2]$c) {
    # 1. Start Pill
    $c.AddRoundRect(345, 20, 150, 52, 26, @("Start"), 19, $true, 2)
    $c.AddOrthoArrow(@(420, 72, 420, 106), @(), 0, 0, 14, $false, $true, 2)

    # 2. Spine Box 1: User Registration/Login
    $c.AddRoundRect(290, 106, 260, 54, 10, @("User Registration / Login"), 15, $true, 2)
    $c.AddOrthoArrow(@(420, 160, 420, 194), @(), 0, 0, 14, $false, $true, 2)

    # 3. Spine Box 2: Upload Resume & Profile
    $c.AddRoundRect(290, 194, 260, 54, 10, @("Upload Resume & Profile"), 15, $true, 2)
    $c.AddOrthoArrow(@(420, 248, 420, 282), @(), 0, 0, 14, $false, $true, 2)

    # 4. Spine Box 3: AI Skill Gap Analysis
    $c.AddRoundRect(290, 282, 260, 54, 10, @("AI Skill Gap Analysis"), 15, $true, 2)
    $c.AddOrthoArrow(@(420, 336, 420, 370), @(), 0, 0, 14, $false, $true, 2)

    # 5. Spine Box 4: Browse Job Listings
    $c.AddRoundRect(290, 370, 260, 54, 10, @("Browse Job Listings"), 15, $true, 2)
    $c.AddOrthoArrow(@(420, 424, 420, 456), @(), 0, 0, 14, $false, $true, 2)

    # 6. Decision Diamond 1: Apply for Job?
    $c.AddDiamond(420, 508, 108, 52, @("Apply for", "Job?"), 15, $true, 2)

    # 7. Left Branch from Diamond 1: Go to Home/logout -> End
    $c.AddOrthoArrow(@(312, 508, 150, 508, 150, 546), @("No"), 270, 488, 16, $false, $true, 2)
    $c.AddRect(30, 546, 240, 62, @("Go to Home / Logout"), 15, $true, 2)
    $c.AddOrthoArrow(@(155, 608, 155, 964, 345, 964), @(), 0, 0, 14, $false, $true, 2)

    # 8. Right Branch from Diamond 1: Submit Application -> Application Shortlisted?
    $c.AddOrthoArrow(@(528, 508, 665, 508, 665, 546), @("Yes"), 560, 488, 16, $false, $true, 2)
    $c.AddRect(550, 546, 230, 56, @("Submit Application"), 15, $true, 2)
    $c.AddOrthoArrow(@(550, 574, 485, 574, 485, 616), @(), 0, 0, 14, $false, $true, 2)

    # 9. Decision Diamond 2: Application Shortlisted?
    $c.AddDiamond(485, 670, 122, 54, @("Application", "Shortlisted?"), 15, $true, 2)

    # 10. Left Branch from Diamond 2: Application Rejected -> End
    $c.AddOrthoArrow(@(363, 670, 315, 670, 315, 706), @("No"), 336, 652, 16, $false, $true, 2)
    $c.AddRoundRect(215, 706, 210, 52, 10, @("Application Rejected"), 15, $true, 2)
    $c.AddOrthoArrow(@(395, 758, 395, 938), @(), 0, 0, 14, $false, $true, 2)

    # 11. Right Branch from Diamond 2: 4-box stack -> End
    $c.AddOrthoArrow(@(607, 670, 727, 670, 727, 698), @("Yes"), 632, 652, 16, $false, $true, 2)
    $c.AddRoundRect(620, 698, 214, 48, 10, @("Shortlist Candidate"), 15, $true, 2)
    $c.AddOrthoArrow(@(727, 746, 727, 768), @(), 0, 0, 14, $false, $true, 2)

    $c.AddRoundRect(620, 768, 214, 46, 10, @("Send Notification"), 15, $true, 2)
    $c.AddOrthoArrow(@(727, 814, 727, 834), @(), 0, 0, 14, $false, $true, 2)

    $c.AddRoundRect(620, 834, 214, 46, 10, @("Faculty Placement View"), 15, $true, 2)
    $c.AddOrthoArrow(@(727, 880, 727, 900), @(), 0, 0, 14, $false, $true, 2)

    $c.AddRoundRect(620, 900, 214, 52, 10, @("Admin Management"), 15, $true, 2)
    $c.AddOrthoArrow(@(727, 952, 727, 968, 535, 968), @(), 0, 0, 14, $false, $true, 2)

    # 12. End Pill
    $c.AddRoundRect(345, 938, 190, 52, 26, @("End"), 19, $true, 2)
}

function Build-ErDiagram([VectorCanvas2]$c) {
    # 0. Legend (Top-Left, Chen ER notation)
    $c.AddErLegend(28, 16)

    # =========================================================================
    # SPACIOUS 2-COLUMN x 3-ROW GRID OF THE 6 CORE PROJECT ENTITIES
    # Col 1 Center = 255 | Mid X = 450 | Col 2 Center = 645
    # Row 1 Center = 250 | Mid Y12 = 395 | Row 2 Center = 540 | Mid Y23 = 685 | Row 3 Center = 830
    # =========================================================================

    # 1. RESUMES (Row 1, Col 1: cx=255, cy=250, w=148, h=56)
    $c.AddRect(181, 222, 148, 56, @("RESUMES"), 17, $true, 2)
    $c.AddSpokeOval(255, 250, 148, 56, 275, 145, 64, 24, "resume_id", 15)
    $c.AddSpokeOval(255, 250, 148, 56, 82, 205, 64, 24, "file_name", 15)
    $c.AddSpokeOval(255, 250, 148, 56, 82, 295, 62, 24, "is_active", 15)

    # 2. STUDENTS (Row 1, Col 2: cx=645, cy=250, w=148, h=56)
    $c.AddRect(571, 222, 148, 56, @("STUDENTS"), 17, $true, 2)
    $c.AddSpokeOval(645, 250, 148, 56, 565, 140, 64, 24, "student_id", 15)
    $c.AddSpokeOval(645, 250, 148, 56, 735, 140, 64, 24, "full_name", 15)
    $c.AddSpokeOval(645, 250, 148, 56, 822, 210, 54, 24, "cgpa", 15)
    $c.AddSpokeOval(645, 250, 148, 56, 822, 292, 54, 24, "skills", 15)

    # 3. AI_ANALYSIS (Row 2, Col 1: cx=255, cy=540, w=148, h=56)
    $c.AddRect(181, 512, 148, 56, @("AI_ANALYSIS"), 16, $true, 2)
    $c.AddSpokeOval(255, 540, 148, 56, 84, 472, 66, 24, "analysis_id", 15)
    $c.AddSpokeOval(255, 540, 148, 56, 78, 544, 68, 24, "match_score", 15)
    $c.AddSpokeOval(255, 540, 148, 56, 88, 616, 62, 24, "skill_gap", 15)

    # 4. APPLICATIONS (Row 2, Col 2: cx=645, cy=540, w=148, h=56)
    $c.AddRect(571, 512, 148, 56, @("APPLICATIONS"), 16, $true, 2)
    $c.AddSpokeOval(645, 540, 148, 56, 820, 472, 58, 24, "app_id", 15)
    $c.AddSpokeOval(645, 540, 148, 56, 824, 544, 58, 24, "status", 15)
    $c.AddSpokeOval(645, 540, 148, 56, 816, 616, 64, 24, "ats_score", 15)

    # 5. COMPANIES (Row 3, Col 1: cx=255, cy=830, w=148, h=56)
    $c.AddRect(181, 802, 148, 56, @("COMPANIES"), 17, $true, 2)
    $c.AddSpokeOval(255, 830, 148, 56, 84, 785, 68, 24, "company_id", 15)
    $c.AddSpokeOval(255, 830, 148, 56, 84, 865, 56, 24, "name", 15)
    $c.AddSpokeOval(255, 830, 148, 56, 255, 932, 62, 24, "industry", 15)

    # 6. JOBS (Row 3, Col 2: cx=645, cy=830, w=148, h=56)
    $c.AddRect(571, 802, 148, 56, @("JOBS"), 17, $true, 2)
    $c.AddSpokeOval(645, 830, 148, 56, 820, 785, 56, 24, "job_id", 15)
    $c.AddSpokeOval(645, 830, 148, 56, 820, 865, 62, 24, "job_title", 15)
    $c.AddSpokeOval(645, 830, 148, 56, 735, 932, 64, 24, "req_skills", 15)
    $c.AddSpokeOval(645, 830, 148, 56, 565, 932, 60, 24, "package", 15)

    # =========================================================================
    # 6 STRAIGHT ORTHOGONAL RELATIONSHIPS (ZERO CROSSING OR STEPPED LINES)
    # =========================================================================

    # R1: STUDENTS (1) --- Uploads --- (M) RESUMES (Row 1 Horizontal)
    $c.AddDiamond(450, 250, 62, 32, @("Uploads"), 15, $true, 2)
    $c.AddErConnector(@(329, 250, 388, 250), "M", "", 2)
    $c.AddErConnector(@(512, 250, 571, 250), "", "1", 2)

    # R2: RESUMES (1) --- Analyzes --- (M) AI_ANALYSIS (Col 1 Vertical)
    $c.AddDiamond(255, 395, 62, 32, @("Analyzes"), 15, $true, 2)
    $c.AddErConnector(@(255, 278, 255, 363), "1", "", 2)
    $c.AddErConnector(@(255, 427, 255, 512), "", "M", 2)

    # R3: STUDENTS (1) --- Submits --- (M) APPLICATIONS (Col 2 Vertical)
    $c.AddDiamond(645, 395, 62, 32, @("Submits"), 15, $true, 2)
    $c.AddErConnector(@(645, 278, 645, 363), "1", "", 2)
    $c.AddErConnector(@(645, 427, 645, 512), "", "M", 2)

    # R4: AI_ANALYSIS (1) --- Links --- (1) APPLICATIONS (Row 2 Horizontal)
    $c.AddDiamond(450, 540, 60, 32, @("Links"), 15, $true, 2)
    $c.AddErConnector(@(329, 540, 390, 540), "1", "", 2)
    $c.AddErConnector(@(510, 540, 571, 540), "", "1", 2)

    # R5: APPLICATIONS (M) --- For Job --- (1) JOBS (Col 2 Vertical)
    $c.AddDiamond(645, 685, 62, 32, @("For Job"), 15, $true, 2)
    $c.AddErConnector(@(645, 568, 645, 653), "M", "", 2)
    $c.AddErConnector(@(645, 717, 645, 802), "", "1", 2)

    # R6: COMPANIES (1) --- Posts --- (M) JOBS (Row 3 Horizontal)
    $c.AddDiamond(450, 830, 60, 32, @("Posts"), 15, $true, 2)
    $c.AddErConnector(@(329, 830, 390, 830), "1", "", 2)
    $c.AddErConnector(@(510, 830, 571, 830), "", "M", 2)
}

$primaryDir = "C:\1 . project\Placement Prediction\diagrams"

# 1. DFD_Level_0
$c0 = New-Object VectorCanvas2(920, 445)
Build-Level0 $c0 0 $false
$c0.SaveSvg("$primaryDir\DFD_Level_0.svg")
$c0.SaveEmf("$primaryDir\DFD_Level_0.emf")

# 2. DFD_Level_1
$c1 = New-Object VectorCanvas2(920, 640)
Build-Level1 $c1 0
$c1.SaveSvg("$primaryDir\DFD_Level_1.svg")
$c1.SaveEmf("$primaryDir\DFD_Level_1.emf")

# 3. DFD_Level_2_AI_Analysis
$c2 = New-Object VectorCanvas2(920, 485)
Build-Level2 $c2 0
$c2.SaveSvg("$primaryDir\DFD_Level_2_AI_Analysis.svg")
$c2.SaveEmf("$primaryDir\DFD_Level_2_AI_Analysis.emf")

# 4. DFD_Level_3_Application_Process
$c3 = New-Object VectorCanvas2(920, 485)
Build-Level3 $c3 0
$c3.SaveSvg("$primaryDir\DFD_Level_3_Application_Process.svg")
$c3.SaveEmf("$primaryDir\DFD_Level_3_Application_Process.emf")

# 5. DFD_Level_3_Resume_Analysis (Optional Level-3 for Resume Analysis)
$c3r = New-Object VectorCanvas2(920, 485)
Build-Level3Resume $c3r 0
$c3r.SaveSvg("$primaryDir\DFD_Level_3_Resume_Analysis.svg")
$c3r.SaveEmf("$primaryDir\DFD_Level_3_Resume_Analysis.emf")

# 6. DFD_Report_Page_1 (5.2 Data Flow diagram + Level-0 + Level-1)
$cp1 = New-Object VectorCanvas2(920, 1135)
Build-Level0 $cp1 10 $true
Build-Level1 $cp1 490
$cp1.SaveSvg("$primaryDir\DFD_Report_Page_1.svg")
$cp1.SaveEmf("$primaryDir\DFD_Report_Page_1.emf")

# 7. DFD_Report_Page_2 (Level-2 + Level-3)
$cp2 = New-Object VectorCanvas2(920, 995)
Build-Level2 $cp2 10
Build-Level3 $cp2 505
$cp2.SaveSvg("$primaryDir\DFD_Report_Page_2.svg")
$cp2.SaveEmf("$primaryDir\DFD_Report_Page_2.emf")

# 8. DFD_Main_Flowchart / Main_DFD (Vertical System Flowchart / Main DFD)
$cm = New-Object VectorCanvas2(860, 1010)
Build-MainFlowchart $cm
$cm.SaveSvg("$primaryDir\DFD_Main_Flowchart.svg")
$cm.SaveEmf("$primaryDir\DFD_Main_Flowchart.emf")
$cm.SaveSvg("$primaryDir\Main_DFD.svg")
$cm.SaveEmf("$primaryDir\Main_DFD.emf")

# 9. ER_Diagram / DFD_ER_Diagram (Chen-style Entity-Relationship Diagram)
$cer = New-Object VectorCanvas2(900, 975)
Build-ErDiagram $cer
$cer.SaveSvg("$primaryDir\ER_Diagram.svg")
$cer.SaveEmf("$primaryDir\ER_Diagram.emf")
$cer.SaveSvg("$primaryDir\DFD_ER_Diagram.svg")
$cer.SaveEmf("$primaryDir\DFD_ER_Diagram.emf")

# Copy to project root and artifact folder as well
$files = Get-ChildItem -Path "$primaryDir\*" -Include "DFD_*", "Main_DFD*", "ER_Diagram*" -File
foreach ($f in $files) {
    Copy-Item -Path $f.FullName -Destination "C:\1 . project\Placement Prediction\$($f.Name)" -Force
    Copy-Item -Path $f.FullName -Destination "C:\Users\Roshi\.gemini\antigravity\brain\d03be525-8c0f-4a31-847b-51cf6d379b45\$($f.Name)" -Force
}

Write-Output "Regenerated all 11 SVG and 11 EMF vector files successfully!"


