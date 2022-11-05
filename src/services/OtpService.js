require('dotenv').config();
import { RandomTypes, StringUtils } from '../shared/common/stringUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CacheRepository } from '../shared/cache/cacheRepository';
import { OTP_COUNT } from '../shared/utils/OtpConstant';
import { ERROR_CODE } from '../shared/error/errorCodes';
import HttpError from '../shared/error/app-error';

let generateOtp = (context, identity, secondsExpire, length, format) => {
    return new Promise(async(resolve, reject) => {
        try {
            const otp = StringUtils.randomString(
                length,
                format || RandomTypes.NUMBER_ONLY,
            );
            const key = `otp_${identity}_${context}`;
            dayjs.extend(utc);
            const nowUtc = dayjs()
                .utc()
                .valueOf();

            const checkKey = await CacheRepository.checkKey(key, 'otp');

            const count = await CacheRepository.increaseCount(key);
            const checkTime = await CacheRepository.checkTimeSending(key);
            const checkSpam = await CacheRepository.checkSpam(key);

            if (checkSpam) {
                throw new AppError(ERROR_CODE.YOU_HAVE_BEEN_SPAM);
            }
            if (!checkTime) {
                throw new AppError(ERROR_CODE.YOU_HAVE_RECEIVED_CODE);
            }
            await CacheRepository.del(key);

            const cacheObject = [
                'otp',
                otp,
                'timeSending',
                nowUtc.toString(),
                'count',
                count.toString(),
            ];
            if (checkKey) {
                await CacheRepository.set(key, cacheObject);
            } else {
                const count = OTP_COUNT;
                const cacheObject = [
                    'otp',
                    otp,
                    'timeSending',
                    nowUtc.toString(),
                    'count',
                    count.toString(),
                ];
                await CacheRepository.setKeyToRedis(key, secondsExpire, cacheObject);
            }

            resolve(otp);

        } catch (e) {
            reject(e);
        }
    })
}

let validateOTPVMobile = (context, identity, otpCode) => {
    return new Promise(async(resolve, reject) => {
        try {
            const key = `otp_${identity}_${context}`;
            const requestObject = await CacheRepository.hgetall(key);
            if (
                requestObject &&
                requestObject['otp'] &&
                requestObject['otp'] === +otpCode
            ) {
                await CacheRepository.del(key);
                resolve(true);
            }

            throw new HttpError.fromObject(ERROR_CODE.INVALID_OTP);

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    generateOtp,
    validateOTPVMobile
}