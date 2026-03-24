!macro customInit
  ; Kill running Koodo Reader process before installation to prevent file locking
  nsExec::ExecToLog 'taskkill /f /im "Koodo Reader.exe"'
  Sleep 2000

  ; Remove file type association registry entries to release icon file locks.
  ; Windows Shell holds open handles to registered icon files (epub.ico, pdf.ico, etc.).
  ; Deleting the ProgID registry keys forces the shell to release these locks
  ; before the installer tries to overwrite the icon files.
  nsExec::ExecToLog 'powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command "Get-ChildItem HKCU:\Software\Classes -ErrorAction SilentlyContinue | ForEach-Object { try { $icon = (Get-ItemProperty \"$($_.PSPath)\DefaultIcon\" -ErrorAction SilentlyContinue).\"(default)\"; if ($icon -and $icon -like \"*koodo*\") { Remove-Item $_.PSPath -Recurse -Force -ErrorAction SilentlyContinue } } catch {} }; Start-Sleep -Milliseconds 800"'
!macroend

!macro customUnInstall
  MessageBox MB_YESNO "Do you want to delete all your data including books, notes, highlights, bookmarks, configurations?" /SD IDNO IDNO SkipRemoval
    SetShellVarContext current
    RMDir /r "$APPDATA\koodo-reader"
  SkipRemoval:
!macroend