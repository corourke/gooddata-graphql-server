// GraphQL Resolvers

const gooddata = require("gooddata")
gooddata.config.setCustomDomain("insurance-demo.na.gooddata.com")
const projectId = "k5zklu0ijpzvmmqdst8akqkvczko7unb", // Digital Insurance
      user = "demos+insurance@gooddata.com",
      passwd = "good660"


function login() {
    console.log("LOGIN")
    return new Promise((resolve, reject) => {

        gooddata.user.isLoggedIn().then((status) => {
            if (status === true) {
                resolve()
            } else {
                gooddata.user.login(user, passwd)
                    .then((result) => {
                        console.log("Account Info:\n", result)
                        resolve()
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(error)
                    })
            }
        })
    })
}


export const resolvers = {
    Query: {
        metrics: () => {
            return login().then(() => {
                return gooddata.md.getMetrics(projectId)
                    .then((results) => results)
            }).catch((err) => {
                console.error(err)
                return `{"errors": [{"message": {err}}]}`
            })
        },
        metric: (obj, args, context) => {
            return login().then(() => {
                let elements = [ args.id ]
                return gooddata.execution.getData(projectId, elements)
                    .then((result) => result)
            }).catch((err) => {
                console.error(err)
                return `{"errors": [{"message": {err}}]}`
            })
        }
    },
    MetricMeta: {
        id: (metric) => metric.identifier,
        deprecated: (metric) => (metric.deprecated === '1')
    },
    Metric: {
        id: (obj) => obj.headers[0].id,
        title: (obj) => obj.headers[0].title,
        format: (obj) => obj.headers[0].format,
        data: (obj) => parseFloat(obj.rawData[0][0])
    }
}


// Samples of what the gooddata-js SDK returns

// getMetrics:
// {   link: '/gdc/md/k5zklu0ijpzvmmqdst8akqkvczko7unb/obj/3331',
//     locked: 0,
//     author: '/gdc/account/profile/98d5edb6836b3afb8f45c70134b01b92',
//     tags: 'currency',
//     created: '2016-09-05 16:54:27',
//     deprecated: '0',
//     identifier: 'adlts78WhfEv',
//     summary: '',
//     isProduction: 1,
//     category: 'metric',
//     updated: '2017-06-21 20:17:57',
//     unlisted: 0,
//     title: 'Average Annual Premium',
//     contributor: '/gdc/account/profile/98d5edb6836b3afb8f45c70134b01b92' }


// getData:
// {
//   isLoaded: true,
//   headers:
//   [ { type: 'metric',
//       id: 'aa435s6gegkf',
//       uri: '/gdc/md/k5zklu0ijpzvmmqdst8akqkvczko7unb/obj/8368',
//       title: 'Loss Ratio',
//       format: '#,##0.00' } ],
//       rawData: [ [ '0.456543740349988' ] ],
//   warnings: [],
//   isEmpty: false
// }


