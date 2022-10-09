const bomb          = () => Object.freeze({ rank: 200    })
const marshal       = () => Object.freeze({ rank: 100    })
const general       = () => Object.freeze({ rank: 90     })
const colonel       = () => Object.freeze({ rank: 80     })
const major         = () => Object.freeze({ rank: 70     })
const captain       = () => Object.freeze({ rank: 60     })
const lieutenant    = () => Object.freeze({ rank: 50     })
const sergeant      = () => Object.freeze({ rank: 40     })
const miner         = () => Object.freeze({ rank: 30     })
const scout         = () => Object.freeze({ rank: 20     })
const spy           = () => Object.freeze({ rank: 10     })
const flag          = () => Object.freeze({ rank: 0      })

module.exports = {
    bomb,
    marshal,
    general,
    colonel,
    major,
    captain,
    lieutenant,
    sergeant,
    miner,
    scout,
    spy,
    flag,
}