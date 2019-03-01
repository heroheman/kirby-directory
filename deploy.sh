#! /bin/bash

USER=kirtools
HOST=boethin.uberspace.de
DIR=html

cd api
./curl_github.sh
cd ..

npm run build && rsync -avz --delete dist/ ${USER}@${HOST}:~/${DIR}

exit 0
