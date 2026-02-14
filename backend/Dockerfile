FROM golang:1.25-alpine

WORKDIR /app

# ホットリロード（コード変更を即反映）のために air をインストール
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

# 起動時に air コマンドを実行
CMD ["air", "-c", ".air.toml"]