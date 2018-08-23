#!/usr/bin/env bash


TYPE_BOLD=`tput bold; tput setaf 7`
TYPE_GREEN=`tput setaf 2`
TYPE_NORMAL=`tput sgr0`

BASE_DIR="`dirname \"$0\"`"

showHelp() {
  printf '\n'
  printf "  ${TYPE_BOLD}Usage:${TYPE_NORMAL} ${BASE_DIR} test [options]\n\n"
  printf "  ${TYPE_BOLD}Options:${TYPE_NORMAL}\n"
  printf "    ${TYPE_GREEN}-h, --help${TYPE_NORMAL}       This help text\n"
  printf '\n'
  exit
}

TEST_CMD="${BASE_DIR}/tests/${1}.js"
PATH="${PATH}:${BASE_DIR}/node_modules/.bin"

for i in "$@"; do
  case $i in
    -h|--help)
      showHelp
      exit
      ;;
    --*)
      TEST_CMD_ARGS="${i} ${2}"
      ;;
  esac
  shift
done

echo "TEST_CMD: $TEST_CMD"
echo "TEST_CMD_ARGS: $TEST_CMD_ARGS"

./node_modules/.bin/casperjs test "$TEST_CMD" $TEST_CMD_ARGS