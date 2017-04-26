export default METRIC_TYPE_UNIT = {
    memory: [{
        scale_factor: 1,
        plural: "pages",
        id: 50,
        short_name: "pg",
        name: "page"
    }, {
        scale_factor: 1,
        plural: "splits",
        id: 98,
        short_name: null,
        name: "split"
    }],
    network: [{
        scale_factor: 1,
        plural: "timeouts",
        id: 82,
        short_name: null,
        name: "timeout"
    }, {
        scale_factor: 1,
        plural: "packets",
        id: 26,
        short_name: "pkt",
        name: "packet"
    }, {
        scale_factor: 1,
        plural: "datagrams",
        id: 90,
        short_name: null,
        name: "datagram"
    }, {
        scale_factor: 1,
        plural: "connections",
        id: 18,
        short_name: "conn",
        name: "connection"
    }, {
        scale_factor: 1,
        plural: "messages",
        id: 29,
        short_name: "msg",
        name: "message"
    }, {
        scale_factor: 1,
        plural: "payloads",
        id: 30,
        short_name: null,
        name: "payload"
    }, {
        scale_factor: 1,
        plural: "segments",
        id: 27,
        short_name: "seg",
        name: "segment"
    }, {
        scale_factor: 1,
        plural: "responses",
        id: 28,
        short_name: "rsp",
        name: "response"
    }, {
        scale_factor: 1,
        plural: "requests",
        id: 19,
        short_name: "req",
        name: "request"
    }],
    money: [{
        scale_factor: 1,
        plural: "dollars",
        id: 42,
        short_name: "$",
        name: "dollar"
    }, {
        scale_factor: 1,
        plural: "cents",
        id: 43,
        short_name: "¢",
        name: "cent"
    }],
    cache: [{
        scale_factor: 1,
        plural: "hits",
        id: 39,
        short_name: "hit",
        name: "hit"
    }, {
        scale_factor: 1,
        plural: "gets",
        id: 65,
        short_name: "get",
        name: "get"
    }, {
        scale_factor: 1,
        plural: "sets",
        id: 66,
        short_name: "set",
        name: "set"
    }, {
        scale_factor: 1,
        plural: "misses",
        id: 40,
        short_name: null,
        name: "miss"
    }, {
        scale_factor: 1,
        plural: "evictions",
        id: 41,
        short_name: null,
        name: "eviction"
    }],
    db: [{
        scale_factor: 1,
        plural: "queries",
        id: 37,
        short_name: null,
        name: "query"
    }, {
        scale_factor: 1,
        plural: "rows",
        id: 38,
        short_name: "row",
        name: "row"
    }, {
        scale_factor: 1,
        plural: "assertions",
        id: 62,
        short_name: "assert",
        name: "assertion"
    }, {
        scale_factor: 1,
        plural: "tickets",
        id: 97,
        short_name: null,
        name: "ticket"
    }, {
        scale_factor: 1,
        plural: "refreshes",
        id: 77,
        short_name: null,
        name: "refresh"
    }, {
        scale_factor: 1,
        plural: "merges",
        id: 76,
        short_name: null,
        name: "merge"
    }, {
        scale_factor: 1,
        plural: "flushes",
        id: 75,
        short_name: null,
        name: "flush"
    }, {
        scale_factor: 1,
        plural: "indices",
        id: 34,
        short_name: "idx",
        name: "index"
    }, {
        scale_factor: 1,
        plural: "keys",
        id: 47,
        short_name: "key",
        name: "key"
    }, {
        scale_factor: 1,
        plural: "offsets",
        id: 49,
        short_name: null,
        name: "offset"
    }, {
        scale_factor: 1,
        plural: "waits",
        id: 96,
        short_name: null,
        name: "wait"
    }, {
        scale_factor: 1,
        plural: "columns",
        id: 91,
        short_name: "col",
        name: "column"
    }, {
        scale_factor: 1,
        plural: "commits",
        id: 95,
        short_name: null,
        name: "commit"
    }, {
        scale_factor: 1,
        plural: "tables",
        id: 33,
        short_name: null,
        name: "table"
    }, {
        scale_factor: 1,
        plural: "transactions",
        id: 36,
        short_name: "tx",
        name: "transaction"
    }, {
        scale_factor: 1,
        plural: "cursors",
        id: 61,
        short_name: null,
        name: "cursor"
    }, {
        scale_factor: 1,
        plural: "records",
        id: 59,
        short_name: null,
        name: "record"
    }, {
        scale_factor: 1,
        plural: "fetches",
        id: 78,
        short_name: null,
        name: "fetch"
    }, {
        scale_factor: 1,
        plural: "scans",
        id: 67,
        short_name: null,
        name: "scan"
    }, {
        scale_factor: 1,
        plural: "locks",
        id: 35,
        short_name: null,
        name: "lock"
    }, {
        scale_factor: 1,
        plural: "shards",
        id: 74,
        short_name: null,
        name: "shard"
    }, {
        scale_factor: 1,
        plural: "documents",
        id: 73,
        short_name: null,
        name: "document"
    }, {
        scale_factor: 1,
        plural: "objects",
        id: 60,
        short_name: null,
        name: "object"
    }, {
        scale_factor: 1,
        plural: "commands",
        id: 48,
        short_name: "cmd",
        name: "command"
    }],
    system: [{
        scale_factor: 1,
        plural: "nodes",
        id: 46,
        short_name: null,
        name: "node"
    }, {
        scale_factor: 1,
        plural: "cores",
        id: 31,
        short_name: null,
        name: "core"
    }, {
        scale_factor: 1,
        plural: "hosts",
        id: 45,
        short_name: null,
        name: "host"
    }, {
        scale_factor: 1,
        plural: "threads",
        id: 32,
        short_name: null,
        name: "thread"
    }, {
        scale_factor: 1,
        plural: "faults",
        id: 63,
        short_name: null,
        name: "fault"
    }, {
        scale_factor: 1,
        plural: "services",
        id: 69,
        short_name: "svc",
        name: "service"
    }, {
        scale_factor: 1,
        plural: "processes",
        id: 20,
        short_name: "proc",
        name: "process"
    }, {
        scale_factor: 1,
        plural: "instances",
        id: 93,
        short_name: null,
        name: "instance"
    }],
    general: [{
        scale_factor: 1,
        plural: "reads",
        id: 51,
        short_name: "rd",
        name: "read"
    }, {
        scale_factor: 1,
        plural: "resources",
        id: 72,
        short_name: "res",
        name: "resource"
    }, {
        scale_factor: 1,
        plural: "occurrences",
        id: 53,
        short_name: null,
        name: "occurrence"
    }, {
        scale_factor: 1,
        plural: "operations",
        id: 57,
        short_name: "op",
        name: "operation"
    }, {
        scale_factor: 1,
        plural: "events",
        id: 54,
        short_name: null,
        name: "event"
    }, {
        scale_factor: 1,
        plural: "items",
        id: 58,
        short_name: null,
        name: "item"
    }, {
        scale_factor: 1,
        plural: "emails",
        id: 89,
        short_name: null,
        name: "email"
    }, {
        scale_factor: 1,
        plural: "units",
        id: 56,
        short_name: null,
        name: "unit"
    }, {
        scale_factor: 1,
        plural: "garbage collections",
        id: 79,
        short_name: "gc",
        name: "garbage collection"
    }, {
        scale_factor: 1,
        plural: "workers",
        id: 71,
        short_name: null,
        name: "worker"
    }, {
        scale_factor: 1,
        plural: "errors",
        id: 44,
        short_name: "err",
        name: "error"
    }, {
        scale_factor: 1,
        plural: "samples",
        id: 94,
        short_name: "smpl",
        name: "sample"
    }, {
        scale_factor: 1,
        plural: "writes",
        id: 52,
        short_name: "wr",
        name: "write"
    }, {
        scale_factor: 1,
        plural: "buffers",
        id: 22,
        short_name: "buff",
        name: "buffer"
    }, {
        scale_factor: 1,
        plural: "tasks",
        id: 70,
        short_name: null,
        name: "task"
    }, {
        scale_factor: 1,
        plural: "times",
        id: 55,
        short_name: null,
        name: "time"
    }],
    bytes: [{
        scale_factor: .125,
        plural: "bits",
        id: 1,
        short_name: "b",
        name: "bit"
    }, {
        scale_factor: 1,
        plural: "bytes",
        id: 2,
        short_name: "B",
        name: "byte"
    }, {
        scale_factor: 1024,
        plural: "kibibytes",
        id: 3,
        short_name: "KiB",
        name: "kibibyte"
    }, {
        scale_factor: 1048576,
        plural: "mebibytes",
        id: 4,
        short_name: "MiB",
        name: "mebibyte"
    }, {
        scale_factor: 1073741824,
        plural: "gibibytes",
        id: 5,
        short_name: "GiB",
        name: "gibibyte"
    }, {
        scale_factor: 1099511627776,
        plural: "tebibytes",
        id: 6,
        short_name: "TiB",
        name: "tebibyte"
    }, {
        scale_factor: 0x3fffffffffffc,
        plural: "pebibytes",
        id: 7,
        short_name: "PiB",
        name: "pebibyte"
    }, {
        scale_factor: 115292150460685e4,
        plural: "exbibytes",
        id: 8,
        short_name: "EiB",
        name: "exbibyte"
    }],
    frequency: [{
        scale_factor: 1,
        plural: "hertz",
        id: 85,
        short_name: "Hz",
        name: "hertz"
    }, {
        scale_factor: 1e3,
        plural: "kilohertz",
        id: 86,
        short_name: "kHz",
        name: "kilohertz"
    }, {
        scale_factor: 1e6,
        plural: "megahertz",
        id: 87,
        short_name: "mHz",
        name: "megahertz"
    }, {
        scale_factor: 1e9,
        plural: "gigahertz",
        id: 88,
        short_name: "gHz",
        name: "gigahertz"
    }],
    time: [{
        scale_factor: 1e-9,
        plural: "nanoseconds",
        id: 68,
        short_name: "ns",
        name: "nanosecond"
    }, {
        scale_factor: 1e-6,
        plural: "microseconds",
        id: 9,
        short_name: "us",
        name: "microsecond"
    }, {
        scale_factor: .001,
        plural: "milliseconds",
        id: 10,
        short_name: "ms",
        name: "millisecond"
    }, {
        scale_factor: 1,
        plural: "seconds",
        id: 11,
        short_name: "s",
        name: "second"
    }, {
        scale_factor: 60,
        plural: "minutes",
        id: 12,
        short_name: "min",
        name: "minute"
    }, {
        scale_factor: 3600,
        plural: "hours",
        id: 13,
        short_name: "hr",
        name: "hour"
    }, {
        scale_factor: 86400,
        plural: "days",
        id: 14,
        short_name: "day",
        name: "day"
    }, {
        scale_factor: 604800,
        plural: "weeks",
        id: 15,
        short_name: "wk",
        name: "week"
    }],
    percentage: [{
        scale_factor: 1e-9,
        plural: "percent_nano",
        id: 64,
        short_name: "%",
        name: "percent_nano"
    }, {
        scale_factor: 1,
        plural: "apdex",
        id: 92,
        short_name: null,
        name: "apdex"
    }, {
        scale_factor: 1,
        plural: "percent",
        id: 17,
        short_name: "%",
        name: "percent"
    }, {
        scale_factor: .01,
        plural: "percent*100",
        id: null,
        short_name: "%",
        name: "percent*100"
    }, {
        scale_factor: 100,
        plural: "fractions",
        id: 16,
        short_name: null,
        name: "fraction"
    }],
    disk: [{
        scale_factor: 1,
        plural: "sectors",
        id: 24,
        short_name: null,
        name: "sector"
    }, {
        scale_factor: 1,
        plural: "blocks",
        id: 25,
        short_name: "blk",
        name: "block"
    }, {
        scale_factor: 1,
        plural: "inodes",
        id: 23,
        short_name: null,
        name: "inode"
    }, {
        scale_factor: 1,
        plural: "files",
        id: 21,
        short_name: "file",
        name: "file"
    }]
};