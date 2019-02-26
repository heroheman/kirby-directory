#! /bin/bash

USER=kirtools
HOST=boethin.uberspace.de
DIR=html

cd api
./curl_github.sh
cd ..

npm run build && rsync -avz --delete dist/ ${USER}@${HOST}:~/${DIR}

scp ${USER}@${HOST}:~/${DIR}/static/api chmod +x curl_github.sh

exit 0
