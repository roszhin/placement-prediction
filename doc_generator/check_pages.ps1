$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction.docx', $false, $true)
    $doc.Repaginate()
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        $p = $doc.Paragraphs.Item($i)
        $style = $p.Style.NameLocal
        $text = $p.Range.Text.Trim()
        if ($text -match '^[0-9]+\.\s+[A-Z\s]+' -or $text -match '^(CERTIFICATE|DECLARATION|ACKNOWLEDGEMENT|ABSTRACT|TABLE OF CONTENTS|LIST OF FIGURES)') {
            $page = $p.Range.Information(3) # 3 = wdActiveEndPageNumber
            Write-Host "$text -> Page $page"
        }
    }
    $total = $doc.ComputeStatistics(2)
    Write-Host "TOTAL PAGES: $total"
    $doc.Close($false)
} finally {
    $word.Quit()
}
