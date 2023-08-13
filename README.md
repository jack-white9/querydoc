# Querydoc

A CLI tool to query documents from a local directory using a large language model (LLM).

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

## Example

![result](https://github.com/jack-white9/querydoc/assets/83393304/b367bebd-b8af-4cf9-9359-58c9badde523)

