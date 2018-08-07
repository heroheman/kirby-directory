#! /bin/bash

for (( counter=1; counter<=6; counter+=1 )); do
    curl -vs "https://api.github.com/search/issues?q=is:open+repo:jenstornell/kirby-plugins&sort=updated&order=desc&per_page=100&page=$counter"| jq -r '.items' > tmp/page-$counter.json
done

jq -s '[.[][]]' tmp/page-*.json > items.json

rm tmp/page-*

