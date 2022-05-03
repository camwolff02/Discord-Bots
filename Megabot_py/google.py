from googlesearch import search

# to search
query = "which harry potter house are you based on your favorite food"

# for j in search(query, tld="co.in", num=5, stop=5, pause=2):
#     print(j)

print( search(query, tld="co.in", num=1, stop=1, pause=2) )