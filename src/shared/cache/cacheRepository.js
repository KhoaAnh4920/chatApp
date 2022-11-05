require('dotenv').config();
import Redis from 'ioredis';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';



const redisClient = new Redis(6379);

export class CacheRepository {
    static checkKey = async(key, field) => {
        const value = await redisClient.hgetall(key);
        return !!value[field];
    }

    static del = (key) => {
        return new Promise(async(resolve, reject) => {
            redisClient.del(key, error => {
                console.log('key del: ', key)
                if (error) {
                    console.log('bbb')
                    reject(error)
                    console.log(`[Redis del error] ${error}`.red)
                } else {
                    console.log('True')
                    resolve(true)
                }
            })
        })
    }

    static hgetall = (key) => {
        return new Promise((resolve, reject) => {
            redisClient.hgetall(key, (error, value) => {
                if (error) {
                    reject(error)
                    console.log(`[Redis hgetall error] ${error}`.red)
                } else {
                    if (!value) return resolve({})
                    let result = {}
                    for (let [_key, _value] of Object.entries(value)) {
                        try {
                            result[_key] = JSON.parse(_value)
                        } catch (error) {
                            result[_key] = _value
                        }
                    }
                    resolve(result)
                }
            })
        })
    }


    static checkSpam = async(key) => {
        const value = await redisClient.hgetall(key);
        const count = parseInt(value.count);
        if (!!count) {
            if (count < 5) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    static increaseCount = async(key) => {
        console.log('key: ', key);
        const value = await redisClient.hgetall(key);
        console.log('value: ', value);
        let count = 0
        if (value.count)
            count = value.count;
        return (count += 1);
    }

    static checkTimeSending = async(key) => {
        const value = await redisClient.hgetall(key);
        const timeSending = parseInt(value.timeSending);
        dayjs.extend(utc);
        const now = dayjs()
            .utc()
            .valueOf();
        if (JSON.stringify(value) === JSON.stringify({})) {
            return true;
        }
        if (now - timeSending > 120000) {
            return true;
        } else {
            return false;
        }
    }


    static set = async(key, args) => {
        await redisClient.hmset(key, args);
    }


    static setKeyToRedis = async(key, expTime, args) => {
        await this.del(key);
        await redisClient.hmset(key, args);
        if (expTime) {
            await redisClient.expire(key, expTime);
        }
    }
}