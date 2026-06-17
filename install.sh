#!/bin/sh
# LayoutPick installer — macOS only. Usage: curl -fsSL https://layoutpick.com/install.sh | sh
set -eu

REPO="layoutpick/layoutpick"
DEST_DIR="$HOME/.layoutpick/bin"
DEST="$DEST_DIR/layoutpick"

os="$(uname -s)"
if [ "$os" != "Darwin" ]; then
  echo "LayoutPick currently supports macOS only (got: $os)." >&2
  exit 1
fi

arch="$(uname -m)"
case "$arch" in
  arm64) asset="layoutpick-darwin-arm64" ;;
  x86_64) asset="layoutpick-darwin-x64" ;;
  *) echo "Unsupported architecture: $arch" >&2; exit 1 ;;
esac

url="https://github.com/$REPO/releases/latest/download/$asset"
echo "Downloading $asset…"
mkdir -p "$DEST_DIR"
if ! curl -fsSL "$url" -o "$DEST"; then
  echo "Download failed from $url" >&2
  echo "(Has the first release been published yet?)" >&2
  exit 1
fi
chmod +x "$DEST"

echo "Registering native host + /pick command…"
"$DEST" install

echo
echo "✓ LayoutPick installed to $DEST"
echo "  Add 'layoutpick' to your PATH if you want to call it directly:"
echo "    export PATH=\"\$HOME/.layoutpick/bin:\$PATH\""
