const ENV = require("./env.js")
// "http://devices-test.microwise-system.com/api/v1/"
const API_BASE = ENV.housekeeper.api

var encodeForm = function (data) {
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

// 封装用户逻辑
function User(attr) {
  this.attr = attr
}

// 是否可以配置序列号、生产日期、硬件版本
User.prototype.canGenerateSN = function() {
    return this.attr.manufacturer != null
}

// 是否可以手动输入序列号、生产日期、硬件版本
User.prototype.canInputSN = function() {
    return this.attr.username == 'administrator'
}

module.exports = {
    User: User,
    login: function (username, password, callback) {
        // administrator 可以离线登录
        if (username == 'administrator') {
            if (password == 'admin') {
                callback(true, {
                  username: "administrator",
                  full_name: "超级管理员",
                  role: {
                    "RoleID": 1,
                    "RoleName": "administrator",
                    "cnName": "超级管理员"
                  }
                })
            } else {
                callback(false, { error: "用户名密码错误" })
            }
            return
        }

        // 工程版可以离线登录
        if (username == 'gongcheng') {
            if (password == 'gc1234') {
                callback(true, {
                    username: "gongcheng",
                    full_name: "工程部(离线账号)",
                    role: {
                        "RoleID": 3,
                        "RoleName": "normal",
                        "cnName": "普通用户",
                    }
                })
            } else {
                callback(false, { error: "用户名密码错误" })
            }
            return
        }

        var params = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodeForm({username, password}),
        }
        const url = API_BASE + "user_token.json"
        fetch(url, params)
            .then(function (response) {
                response.json().then(function (data) {
                    callback(response.ok, data)
                })
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
    },
    authHeader: function(user) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-User-Name': user.attr.username,
            'X-User-Token': user.attr.token,
        };
    },
    get_product: function (user, device_type, callback) {
        var params = {
            method: "GET",
            headers: this.authHeader(user),
        }
        const url = API_BASE + "products.json?device_type="+device_type
        fetch(url, params)
            .then(function (response) {
                response.json().then(function (data) {
                    callback(response.ok, data)
                })
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
    },
    get_batch: function (user, product_no, callback) {
        var params = {
            method: "GET",
            headers: this.authHeader(user),
        }
        const url = API_BASE + "production_batches.json?product_no="+product_no
        fetch(url, params)
            .then(function (response) {
                response.json().then(function (data) {
                    callback(response.ok, data)
                })
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
    },
    generate_sns: function (user, product_no, production_batch_id,callback) {
        var params = {
            method: "POST",
            headers: this.authHeader(user),
        }
        const url = API_BASE + "sn.json?product_no="+product_no+"&production_batch_id="+production_batch_id
        fetch(url, params)
            .then(function (response) {
                response.json().then(function (data) {
                    callback(response.ok, data)
                })
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
    },
    get_product_by_id: function (user, productNo, callback) {
        var params = {
            method: "GET",
            headers: this.authHeader(user),
        }
        const url = API_BASE + "products/"+productNo+'.json';
        fetch(url, params)
            .then(function (response) {
                response.json().then(function (data) {
                    callback(response.ok, data)
                })
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
    },
}
