param(
  [string]$InputFile = "C:\Users\Administrator\.local\share\opencode\tool-output\tool_0f594bc1d001FM5IDtb2ZalChl",
  [string]$OutFile = "C:\Users\Administrator\Documents\Default Project\stockwise-ai\tools\design-extract.txt"
)

$lines = Get-Content $InputFile

# --- index sections ---
$elStart = ($lines | Select-String -Pattern '^ELEMENTS:$' | Select-Object -First 1).LineNumber - 1
$nodeStart = ($lines | Select-String -Pattern '^NODES:$' | Select-Object -First 1).LineNumber - 1

# --- parse global vars (style_/fill_/layout_) ---
$vars = @{}
$i = 0
while ($i -lt $elStart) {
  $l = $lines[$i]
  if ($l -match '^[A-Za-z_][A-Za-z0-9_]*:$' -and $l -notmatch '^(NAME|GLOBAL_VARS|ELEMENTS|NODES):$') {
    $key = $l.Substring(0, $l.Length - 1)
    $block = @()
    $j = $i + 1
    while ($j -lt $elStart -and ($lines[$j] -match '^\s' -or $lines[$j] -eq '')) { $block += $lines[$j]; $j++ }
    $vars[$key] = $block
    $i = $j
  } else { $i++ }
}

function Get-Var($key) {
  if ($key -and $vars.ContainsKey($key)) { return ($vars[$key] -join ' | ') }
  return ''
}

function Resolve-Text($t) {
  if ($t -match 'textStyle:\s*(\S+)') { $ts = $Matches[1] } else { $ts = '' }
  if ($t -match 'fills:\s*(\S+)') { $fs = $Matches[1] } else { $fs = '' }
  $styleRaw = Get-Var $ts
  $fillRaw = Get-Var $fs
  $font = ''
  if ($styleRaw -match 'fontFamily:\s*(\S+)') { $font = $Matches[1] }
  if ($styleRaw -match 'fontWeight:\s*(\d+)') { $font += ' ' + $Matches[1] }
  if ($styleRaw -match 'fontSize:\s*(\d+)') { $font += '/' + $Matches[1] }
  if ($styleRaw -match 'lineHeight:\s*([^\|]+)') { $font += ' lh' + $Matches[1].Trim() }
  $color = ''
  if ($fillRaw -match "'(#[0-9A-Fa-f]+)'") { $color = $Matches[1] }
  return "$font $color".Trim()
}

function Resolve-Style($layoutRef, $fillsRef, $extra) {
  $layoutRaw = Get-Var $layoutRef
  $fillRaw = Get-Var $fillsRef
  $parts = @()
  if ($layoutRaw -ne '') { $parts += $layoutRaw }
  if ($fillRaw -ne '') { $parts += $fillRaw }
  if ($extra) { $parts += $extra }
  return ($parts -join ' ')
}

# --- parse ELEMENTS ---
$els = @{}
$cur = $null; $buf = @()
for ($i = $elStart + 1; $i -lt $nodeStart; $i++) {
  $l = $lines[$i]
  if ($l -match '^EL-[A-Za-z0-9]+:$') {
    if ($cur) { $els[$cur] = $buf }
    $cur = $l.Substring(0, $l.Length - 1); $buf = @()
  } elseif ($cur) { $buf += $l }
}
if ($cur) { $els[$cur] = $buf }

function Resolve-Element($elId) {
  if (-not $elId -or -not $els.ContainsKey($elId)) { return '' }
  $b = $els[$elId] -join "`n"
  $out = @()
  if ($b -match '(?m)^\s*text:\s*(.+)$') { $out += "TEXT='$($Matches[1])'" }
  if ($b -match '(?m)^\s*textStyle:\s*(\S+)') { $out += "style=$(Resolve-Text $b)" }
  elseif ($b -match '(?m)^\s*textStyle:\s*\n') { }
  # layout details
  $lay = ''
  if ($b -match '(?m)^\s*layout:\s*(\S+)$') {
    $lay = Resolve-Style $Matches[1] $null $null
  } elseif ($b -match '(?ms)^\s*layout:\s*\n(.*?)(?=^\s*(fills|strokes|text|textStyle|borderRadius|strokeWeight|opacity|effects|type):|\z)') {
    $lay = ($Matches[1] -replace '\s+', ' ').Trim()
  }
  if ($lay) { $out += "L[$lay]" }
  $fills = ''
  if ($b -match '(?m)^\s*fills:\s*(\S+)') { $fills = Get-Var $Matches[1] }
  if ($fills) { $out += "F[$fills]" }
  $strokes = ''
  if ($b -match '(?m)^\s*strokes:\s*(\S+)') { $strokes = Get-Var $Matches[1] }
  $sw = ''
  if ($b -match '(?m)^\s*strokeWeight:\s*(\S+)') { $sw = $Matches[1] }
  if ($strokes) { $out += "S[$strokes $sw]" }
  if ($b -match '(?m)^\s*borderRadius:\s*(\S+)') { $out += "R[$($Matches[1])]" }
  if ($b -match '(?m)^\s*opacity:\s*(\S+)') { $out += "op=$($Matches[1])" }
  if ($b -match '(?ms)^\s*effects:\s*\n(.*?)(?=^\S|\z)') { $out += "E[$(($Matches[1] -replace '\s+',' ').Trim())]" }
  return ($out -join ' ')
}

# --- walk NODES ---
$screenRe = '^  \[FRAME\] '
$sb = New-Object System.Text.StringBuilder
$screens = @()
for ($i = $nodeStart + 1; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match $screenRe) { $screens += $i }
}
$screens += $lines.Count

for ($s = 0; $s -lt $screens.Count - 1; $s++) {
  $start = $screens[$s]; $end = $screens[$s + 1]
  $header = $lines[$start]
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine(('=' * 100))
  [void]$sb.AppendLine($header)
  [void]$sb.AppendLine(('=' * 100))
  for ($i = $start + 1; $i -lt $end; $i++) {
    $l = $lines[$i]
    if ($l.Trim() -eq '') { continue }
    $indent = ($l -replace '^(\s*).*$', '$1').Length
    $pad = ' ' * $indent
    $rest = $l.Trim()
    $textInline = ''
    if ($rest -match 'text="(.*)"$') { $textInline = $Matches[1]; $rest = $rest -replace '\s*text=".*"$', '' }
    $elId = ''
    if ($rest -match 'template=(\S+)') { $elId = $Matches[1]; $rest = $rest -replace '\s*template=\S+', '' }
    $layRef = ''
    if ($rest -match '\blayout=([A-Za-z_][A-Za-z0-9_]*)') { $layRef = $Matches[1]; $rest = $rest -replace '\blayout=[A-Za-z_][A-Za-z0-9_]*', '' }
    $fillRef = ''
    if ($rest -match '\bfills=([A-Za-z_][A-Za-z0-9_]*)') { $fillRef = $Matches[1]; $rest = $rest -replace '\bfills=[A-Za-z_][A-Za-z0-9_]*', '' }
    $tsRef = ''
    if ($rest -match '\btextStyle=([A-Za-z_][A-Za-z0-9_]*)') { $tsRef = $Matches[1]; $rest = $rest -replace '\btextStyle=[A-Za-z_][A-Za-z0-9_]*', '' }

    $elRes = Resolve-Element $elId
    $ownRes = ''
    if ($layRef -or $fillRef -or $tsRef) {
      $ownRes = Resolve-Style $layRef $fillRef $null
      if ($tsRef) { $ownRes += ' ' + (Resolve-Text ("textStyle: $tsRef") ) }
    }
    $info = @()
    if ($ownRes) { $info += $ownRes }
    if ($elRes) { $info += $elRes }
    if ($textInline) { $info += "TEXT='$textInline'" }
    $rest = $rest -replace '\s+', ' '
    $line = "$pad$rest"
    if ($info.Count -gt 0) { $line += '   << ' + ($info -join ' ') + ' >>' }
    [void]$sb.AppendLine($line)
  }
}

[System.IO.File]::WriteAllText($OutFile, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Wrote $OutFile ($(([System.IO.FileInfo]$OutFile).Length) bytes)"
