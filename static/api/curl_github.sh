#! /bin/bash

totalcount=$(curl -s https://api.github.com/search/issues?q=is:open+repo:texnixe/kirby-plugins | jq -r '.total_count')

echo $totalcount

iteration=$((totalcount/100+1))



for (( counter=1; counter<=$iteration; counter+=1 )); do
    curl -vs "https://api.github.com/search/issues?q=is:open+repo:texnixe/kirby-plugins&sort=updated&order=desc&per_page=100&page=$counter"| jq -r '.items' > tmp/page-$counter.json
done

rm items.json

jq -s '[.[][]]' tmp/page-*.json > items.json

echo $iteration
jq length items.json

rm tmp/page-*
