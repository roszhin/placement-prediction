$condensedDocx = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction_Condensed.docx"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($condensedDocx, $false, $true)
    $doc.Repaginate()

    Write-Host "PAGES FOR ALL HEADINGS, FIGURES, AND TABLES:"
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        $p = $doc.Paragraphs.Item($i)
        $text = $p.Range.Text.Trim()
        if ($text -match '^(Figure|Table)\s+[0-9]+\.[0-9]+' -or $text -match '^[0-9]+\.[0-9]*\s+[A-Za-z]') {
            $page = $p.Range.Information(3)
            Write-Host ("  {0,-60} -> Page {1}" -f $text, $page)
        }
    }
    $doc.Close($false)
} finally {
    $word.Quit()
}
