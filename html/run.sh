#!/usr/bin/env bash


TYPE_BOLD=`tput bold; tput setaf 7`
TYPE_GREEN=`tput setaf 2`
TYPE_NORMAL=`tput sgr0`

showHelp() {
  printf '\n'
  printf "  ${TYPE_BOLD}Usage:${TYPE_NORMAL} `basename ${0}` test [options]\n\n"
  printf "  ${TYPE_BOLD}Options:${TYPE_NORMAL}\n"
  printf "    ${TYPE_GREEN}-h, --help${TYPE_NORMAL}       This help text\n"
  printf '\n'
  exit
}

BASE_DIR=$(dirname ${0})
TEST_CMD="${BASE_DIR}/tests/${1}.js"
PATH="${PATH}:${BASE_DIR}/node_modules/.bin"

for i in "$@"; do
  case $i in
    -h|--help)
      showHelp
      exit
      ;;
    --*)
      TEST_CMD="${TEST_CMD} ${i} ${2}"
      ;;
  esac
  shift
done

./node_modules/.bin/casperjs test ${TEST_CMD}