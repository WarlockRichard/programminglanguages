import sys
import re
import requests

baseUrl="http://www.mosigra.ru"
linkQueue = set()
linkQueue.add(baseUrl)

mailPattern = r'[a-zA-Z0-9]+(?:[._+%-]+[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]?)+[.][a-zA-Z]{2,}'
urlPattern = r'href="(?:<siteURL>)?(?:\.\.)*(?:\/?[a-zA-Z0-9%-])+\??(?:[a-zA-Z0-9]+\=[a-zA-Z0-9_%-]+[;&]?)*(?:\.html|\.htm|\/)?"'

tempUrl = baseUrl.replace("/", "\/")
tempUrl = tempUrl.replace(".", "\.")
tempUrl = tempUrl.replace("-", "\-")
urlPattern = urlPattern.replace("<siteURL>", tempUrl)

mailREO = re.compile(mailPattern)
urlREO = re.compile(urlPattern)

checkedLinks = set()
mails = set()
print(len(linkQueue))
while (len(checkedLinks) < 50):
    link = linkQueue.pop()
    if(link in checkedLinks):
    	continue
    checkedLinks.add(link)
    try:
        site = requests.get(link, allow_redirects=False)
        matchUrl = urlREO.findall(site.text)
        matchMail = mailREO.findall(site.text)
        for url in matchUrl:
            processableUrl = url[:-1]
            processableUrl = processableUrl.replace('href=\"', "")

            if (processableUrl[0] == "."):
                processableUrl = re.sub(r'\.\.\/', "", processableUrl)
                refinedUrl = link + processableUrl
            elif (processableUrl[0] == "/"):
                refinedUrl = baseUrl + processableUrl
            elif (processableUrl.startswith("http://") == False):
                refinedUrl = baseUrl + "/" + processableUrl
            else:
                refinedUrl = processableUrl
            if (refinedUrl not in checkedLinks):
                linkQueue.add(refinedUrl)
        for mail in matchMail:
            mails.add(mail)

    except requests.exceptions.RequestException as e:
        # Mainly for filtering DNS lookup error
        # It was usefull when redirects was allowed
        print(e)

    print(len(linkQueue))

out = open('out.txt', 'w')
out.write("Checked " + str(len(checkedLinks)) + " links\n")
out.write("With " + str(len(mails)) + " mails:\n")
for mail in mails:
    out.write(mail + '\n')
out.close()

print("Done")
