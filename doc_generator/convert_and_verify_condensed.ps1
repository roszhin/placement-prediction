$origDocx = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction.docx"
$origPdf  = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction.pdf"

Write-Host "=========================================="
Write-Host "1. VERIFYING ORIGINAL 100-PAGE FILES"
Write-Host "=========================================="
if (Test-Path $origDocx) {
    $origDocxItem = Get-Item $origDocx
    Write-Host "Original DOCX Present: $origDocx ($($origDocxItem.Length) bytes, LastWrite: $($origDocxItem.LastWriteTime))"
} else {
    Write-Error "Original DOCX missing!"
}

if (Test-Path $origPdf) {
    $origPdfItem = Get-Item $origPdf
    Write-Host "Original PDF  Present: $origPdf ($($origPdfItem.Length) bytes, LastWrite: $($origPdfItem.LastWriteTime))"
} else {
    Write-Error "Original PDF missing!"
}

$condensedDocx = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction_Condensed.docx"
$condensedPdf  = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction_Condensed.pdf"

Write-Host "`n=========================================="
Write-Host "2. VERIFYING & CONVERTING CONDENSED RECORD"
Write-Host "=========================================="
Write-Host "Opening Microsoft Word to verify Condensed DOCX and export PDF..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($condensedDocx, $false, $true)
    $doc.Repaginate()

    $pageCount = $doc.ComputeStatistics(2) # 2 = wdStatisticPages
    $wordCount = $doc.ComputeStatistics(0) # 0 = wdStatisticWords
    $charCount = $doc.ComputeStatistics(3) # 3 = wdStatisticCharacters
    $paraCount = $doc.ComputeStatistics(4) # 4 = wdStatisticParagraphs

    Write-Host "`n=========================================="
    Write-Host "CONDENSED RECORD COMPILATION STATISTICS"
    Write-Host "=========================================="
    Write-Host "Total Pages:      $pageCount"
    Write-Host "Total Words:      $wordCount"
    Write-Host "Total Characters: $charCount"
    Write-Host "Total Paragraphs: $paraCount"
    Write-Host "=========================================="

    # Chapter breakdown
    Write-Host "`nChapter Heading Page Breakdown:"
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        $p = $doc.Paragraphs.Item($i)
        $style = $p.Style.NameLocal
        $text = $p.Range.Text.Trim()
        if ($style -eq 'Heading 1' -or $text -match '^(BONAFIDE CERTIFICATE|DECLARATION|ACKNOWLEDGEMENT|ABSTRACT|TABLE OF CONTENTS|LIST OF FIGURES AND TABLES)') {
            $page = $p.Range.Information(3)
            Write-Host ("  {0,-35} -> Page {1}" -f $text, $page)
        }
    }

    Write-Host "`nExporting Condensed PDF to: $condensedPdf..."
    $doc.ExportAsFixedFormat($condensedPdf, 17) # 17 = wdExportFormatPDF
    Write-Host "PDF Export Successful!"

    $doc.Close($false)
}
catch {
    Write-Error "Error during Word automation: $_"
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

if (Test-Path $condensedPdf) {
    $pdfSize = (Get-Item $condensedPdf).Length
    Write-Host "Verified Condensed PDF exists on disk: $condensedPdf ($pdfSize bytes)"
}
