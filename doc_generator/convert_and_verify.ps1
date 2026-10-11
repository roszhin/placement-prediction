$docxPath = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction.docx"
$pdfPath = "C:\1 . project\Placement Prediction\output\Project_Record_Placement_Prediction.pdf"

Write-Host "Opening Microsoft Word to verify DOCX and export PDF..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($docxPath, $false, $true)
    
    # Force document pagination update
    $doc.Repaginate()

    $pageCount = $doc.ComputeStatistics(2) # 2 = wdStatisticPages
    $wordCount = $doc.ComputeStatistics(0) # 0 = wdStatisticWords
    $charCount = $doc.ComputeStatistics(3) # 3 = wdStatisticCharacters
    $paraCount = $doc.ComputeStatistics(4) # 4 = wdStatisticParagraphs

    Write-Host "=========================================="
    Write-Host "PROJECT RECORD COMPILATION STATISTICS"
    Write-Host "=========================================="
    Write-Host "Total Pages:      $pageCount"
    Write-Host "Total Words:      $wordCount"
    Write-Host "Total Characters: $charCount"
    Write-Host "Total Paragraphs: $paraCount"
    Write-Host "=========================================="

    Write-Host "Exporting to PDF: $pdfPath..."
    # 17 = wdExportFormatPDF
    $doc.ExportAsFixedFormat($pdfPath, 17)
    Write-Host "PDF export complete!"

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

if (Test-Path $pdfPath) {
    $pdfSize = (Get-Item $pdfPath).Length
    Write-Host "Verified PDF exists on disk: $pdfPath ($pdfSize bytes)"
}
