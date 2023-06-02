echo "Converting PNGs to sillouethes..."

if [[ ! -d ./siluetas ]]; then
  echo "./siluetas not found"
  exit 1
fi

mkdir -p ./siluetas-out

mogrify -format png -path ./siluetas-out -fill "#343435" -colorize 100 ./siluetas/*.png
