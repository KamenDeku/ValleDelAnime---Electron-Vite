import osUtils from 'os-utils';
import fs from 'fs';

const POLLING_INTERVAL = 500;

export function pollResourceUsage() {
  setInterval( async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    console.log({
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage
    });
  }, POLLING_INTERVAL);
}

function getCpuUsage() {
  return new Promise(resolve => {
    osUtils.cpuUsage(resolve)
  })
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C:/' : '/');
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free/total
  };
}

