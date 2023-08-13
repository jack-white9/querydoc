# Querydoc

A CLI tool for using text to query documents within a directory.

## Installation

1. Spin up a local [Chroma](https://github.com/chroma-core/chroma) instance

```shell
git clone git@github.com:chroma-core/chroma.git
cd chroma
docker-compose up -d --build
```

2. Clone this repo and install the `querydoc` package using npm

```shell
git clone git@github.com:jack-white9/querydoc.git
cd querydoc
npm i -g
```

## Usage

Run a query on the documents in a local directory using the following command.

```shell
querydoc query "<insert query>" --dir <insert directory>
```
