/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import $ajax from '../ajax'

/**
 * @desc 用户相关接口
 */
const baseUrl = 'https://quick.shijinzhuang.com/'

export default {
  init(data) {
    return $ajax.get(`${baseUrl}user/init.do`, data)
  }
}
