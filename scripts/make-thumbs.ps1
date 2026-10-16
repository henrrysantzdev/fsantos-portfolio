# Generates resized JPEGs in public/assets/img/thumb:
# - 16:10 covers for the first image of each project, cropped like the cards (object-cover anchored to the top);
# - the 4:3 hero image of the Stitch home, cropped from the center.
# Run from the repo root: powershell -ExecutionPolicy Bypass -File scripts/make-thumbs.ps1
Add-Type -AssemblyName System.Drawing

$outDir = "public/assets/img/thumb"
New-Item -ItemType Directory -Force $outDir | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 74L)

function Save-Crop([string]$relative, [string]$name, [int]$width, [int]$height, [double]$anchorY) {
  $input = Join-Path (Resolve-Path public) $relative
  $output = Join-Path (Resolve-Path $outDir) $name
  $image = [System.Drawing.Image]::FromFile($input)
  try {
    $scale = [Math]::Max($width / $image.Width, $height / $image.Height)
    $cropWidth = $width / $scale
    $cropHeight = $height / $scale
    $crop = New-Object System.Drawing.RectangleF (($image.Width - $cropWidth) / 2), (($image.Height - $cropHeight) * $anchorY), $cropWidth, $cropHeight
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($image, (New-Object System.Drawing.RectangleF 0, 0, $width, $height), $crop, [System.Drawing.GraphicsUnit]::Pixel)
    $bitmap.Save($output, $codec, $params)
    $graphics.Dispose()
    $bitmap.Dispose()
  } finally {
    $image.Dispose()
  }
  "{0,-34} {1,4} KB -> {2,4} KB" -f $name, [int]((Get-Item $input).Length / 1KB), [int]((Get-Item $output).Length / 1KB)
}

$source = Get-Content src/data/projects.ts -Raw
$covers = [regex]::Matches($source, '"img": \["([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($cover in $covers) { Save-Crop $cover ([IO.Path]::GetFileName($cover)) 640 400 0 }

Save-Crop "assets/img/casa-vila-suica-01.jpg" "hero-casa-vila-suica-800.jpg" 800 600 0.5

$logo = [System.Drawing.Image]::FromFile((Join-Path (Resolve-Path public) "assets/img/logo-kf.png"))
try {
  $logoWidth = 720
  $logoHeight = [int][Math]::Round($logo.Height * $logoWidth / $logo.Width)
  $small = New-Object System.Drawing.Bitmap $logoWidth, $logoHeight
  $graphics = [System.Drawing.Graphics]::FromImage($small)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($logo, 0, 0, $logoWidth, $logoHeight)
  $small.Save((Join-Path (Resolve-Path public) "assets/img/logo-kf-720.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $small.Dispose()
} finally {
  $logo.Dispose()
}
"logo-kf-720.png {0} KB" -f [int]((Get-Item public/assets/img/logo-kf-720.png).Length / 1KB)
