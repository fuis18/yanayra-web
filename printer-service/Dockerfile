FROM rust:1.75-alpine AS builder

RUN apk add --no-cache musl-dev protobuf-dev

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY build.rs ./
COPY ../proto ./proto

RUN cargo build --release

FROM alpine:latest

RUN apk add --no-cache libgcc

WORKDIR /app

COPY --from=builder /app/target/release/printer-service /app/printer-service

EXPOSE 50051

CMD ["/app/printer-service"]
