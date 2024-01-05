import https from 'https';
import fs from 'fs';

const blackLists = [
  'https://raw.githubusercontent.com/PolishFiltersTeam/KADhosts/master/KADhosts.txt',
  'https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Spam/hosts',
  'https://v.firebog.net/hosts/static/w3kbl.txt',
  'https://raw.githubusercontent.com/matomo-org/referrer-spam-blacklist/master/spammers.txt',
  'https://someonewhocares.org/hosts/zero/hosts',
  'https://raw.githubusercontent.com/VeleSila/yhosts/master/hosts',
  'https://winhelp2002.mvps.org/hosts.txt',
  'https://v.firebog.net/hosts/neohostsbasic.txt',
  'https://raw.githubusercontent.com/RooneyMcNibNug/pihole-stuff/master/SNAFU.txt',
  'https://paulgb.github.io/BarbBlock/blacklists/hosts-file.txt',
  'https://adaway.org/hosts.txt',
  'https://v.firebog.net/hosts/AdguardDNS.txt',
  'https://v.firebog.net/hosts/Admiral.txt',
  'https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt',
  'https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt',
  'https://v.firebog.net/hosts/Easylist.txt',
  'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext',
  'https://raw.githubusercontent.com/FadeMind/hosts.extras/master/UncheckyAds/hosts',
  'https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts',
  'https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts',
  'https://v.firebog.net/hosts/Easyprivacy.txt',
  'https://v.firebog.net/hosts/Prigent-Ads.txt',
  'https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.2o7Net/hosts',
  'https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt',
  'https://hostfiles.frogeye.fr/firstparty-trackers-hosts.txt',
  'https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/android-tracking.txt',
  'https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt',
  'https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/AmazonFireTV.txt',
  'https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-blocklist.txt',
  'https://v.firebog.net/hosts/Prigent-Crypto.txt',
  'https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts',
  'https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt',
  'https://phishing.army/download/phishing_army_blocklist_extended.txt',
  'https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt',
  'https://v.firebog.net/hosts/RPiList-Malware.txt',
  'https://v.firebog.net/hosts/RPiList-Phishing.txt',
  'https://raw.githubusercontent.com/Spam404/lists/master/main-blacklist.txt',
  'https://raw.githubusercontent.com/AssoEchap/stalkerware-indicators/master/generated/hosts',
  'https://urlhaus.abuse.ch/downloads/hostfile/',
  'https://malware-filter.gitlab.io/malware-filter/phishing-filter-hosts.txt',
  'https://v.firebog.net/hosts/Prigent-Malware.txt',
  'https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt',
  'https://osint.digitalside.it/Threat-Intel/lists/latestdomains.txt',
  'https://zerodot1.gitlab.io/CoinBlockerLists/hosts_browser',
  'https://raw.githubusercontent.com/chadmayfield/my-pihole-blocklists/master/lists/pi_blocklist_porn_top1m.list',
  'https://v.firebog.net/hosts/Prigent-Adult.txt',
  'https://raw.githubusercontent.com/anudeepND/blacklist/master/facebook.txt',
  'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/domains/pro.txt',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/Win10Telemetry',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/crypto',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/gambling',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/malware',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/DomainSquatting1',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/DomainSquatting2',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/pornblock1',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/pornblock2',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/pornblock3',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/pornblock4',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/proxies',
  'https://raw.githubusercontent.com/RPiList/specials/master/Blocklisten/Fake-Science',
  'https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt',
  'https://www.github.developerdan.com/hosts/lists/facebook-extended.txt',
  'https://www.github.developerdan.com/hosts/lists/dating-services-extended.txt',
  'https://www.github.developerdan.com/hosts/lists/hate-and-junk-extended.txt',
  'https://www.github.developerdan.com/hosts/lists/tracking-aggressive-extended.txt',
];

const set = new Set();

const downloadList = async (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, function (res) {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          Buffer.concat(chunks)
            .toString()
            .split(/\r?\n/)
            .forEach((line) => {
              const trimmedLine = line.trim();

              if (!trimmedLine.startsWith('#')) {
                set.add(trimmedLine);
              }
            });

          resolve();
        });

        res.on('error', (err) => {
          reject(err);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const promisses = [];

for (const blackList of blackLists) {
  try {
    promisses.push(downloadList(blackList));
  } catch (err) {
    console.error(err);
  }
}

(await Promise.allSettled(promisses)).forEach((promiss) => {
  if (promiss.status !== 'fulfilled') {
    console.error(promiss.reason);
  }
});

const file = fs.createWriteStream('out/pihole-block-list.txt');

file.on('error', console.error);
file.on('finish', () => {
  file.close();
  console.log('Download Completed');
});

for (const line of set) {
  file.write(`${line}\n`);
}
