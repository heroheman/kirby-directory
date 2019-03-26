#! /bin/bash

USER=kirtools
HOST=boethin.uberspace.de
DIR=html

npm run build && rsync -avz --delete dist/ ${USER}@${HOST}:~/${DIR}

# ssh ${USER}@${HOST} 'bash -s' <<-'ENDSSH'
# ENDSSH

exit 0
