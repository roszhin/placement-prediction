$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction.docx', $false, $true)
    $doc.Repaginate()
    
    $headings = @()
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        $p = $doc.Paragraphs.Item($i)
        $style = $p.Style.NameLocal
        $text = $p.Range.Text.Trim()
        if ($style -eq 'Heading 1' -or $text -match '^(BONAFIDE CERTIFICATE|DECLARATION|ACKNOWLEDGEMENT|ABSTRACT|TABLE OF CONTENTS|LIST OF FIGURES|LIST OF TABLES)') {
            $page = $p.Range.Information(3)
            $headings += [PSCustomObject]@{ Title = $text; Page = $page }
        }
    }
    
    for ($j = 0; $j -lt $headings.Count; $j++) {
        $curr = $headings[$j]
        $nextPage = if ($j -lt $headings.Count - 1) { $headings[$j+1].Page } else { $doc.ComputeStatistics(2) + 1 }
        $pages = $nextPage - $curr.Page
        Write-Host ("{0,-40} : Page {1,2} to {2,2} ({3} pages)" -f $curr.Title, $curr.Page, ($nextPage - 1), $pages)
    }
    
    Write-Host ("`nTOTAL PAGES: " + $doc.ComputeStatistics(2))
    $doc.Close($false)
} finally {
    $word.Quit()
}
