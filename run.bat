@echo off
docker build . -t "jx/mockups-creator"
docker run -v ./app:/src/app "jx/mockups-creator"