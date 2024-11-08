let memories ={};
export default {
  getMemory: (key: string) => memories[key],
  setMemory: (key: string, value: any, expiry?: number) => { 
    memories[key] = value;
    if (expiry) {
      setTimeout(() => {
        console.log(`[message] auto delete cache ${key}`)
        delete memories[key];
      }, expiry);
    }
  },
  remove: (key: string) => { delete memories[key]; },
};
