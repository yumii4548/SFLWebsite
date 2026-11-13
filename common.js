(function (global) {
    'use strict';

    var SITE = {
        name: '极鱼社',
        en: 'SwiftFishLab',
        desc: 'Minecraft 综合型开发团队',
        qq: {
            chat: '914029611',
            chatUrl: 'https://qm.qq.com/q/22asfFbLhC',
            join1: '2176179242',
            join1Url: 'https://qm.qq.com/q/pcNCh1Bj2M',
            join2: '83345672'
        }
    };

    var SERVICES = [
        { id: 'skinsubmit', icon: 'fa-solid fa-arrow-up-right-from-square', name: '授权原创皮肤代投', subtitle: 'SKIN SUBMISSION SERVICE', desc: '提供授权皮肤代投服务，应用自研快速渲染包装提审系统，专业对接MC开发者平台审核通道，高效稳定，让你的皮肤作品快速上架。', features: ['自研自动化工具', '账号矩阵排列', '快速上架', '全程跟踪反馈'], price: '免费', badge: 'NEW', color: '#ec4899', url: 'https://wj.qq.com/s2/14959219/elqb/' },
        { id: 'skin', icon: 'fa-solid fa-palette', name: 'MC 皮肤定制', subtitle: 'SKIN CUSTOMIZATION', desc: '打造独一无二的皮肤，涵盖多种风格，从可爱萌系到硬核战斗，总有一款适合你，支持商用及买断，网易/基岩/Java版本通用。', features: ['皮肤设计', '贴图定制', '定制化修改', '版本通用'], price: '¥20 起', badge: 'POPULAR', color: '#00d4ff', url: 'https://qm.qq.com/q/CxSaz8xFRK' },
        { id: 'build', icon: 'fa-solid fa-landmark', name: '建筑承包', subtitle: 'ARCHITECTURE CONTRACTING', desc: '精美像素建筑，涵盖古风建筑与现代都市，从单体景观到完整城市规划，专业团队施工建造。', features: ['古建筑群建造', '现代建筑设计', '大型地图规划', '服务器主城建设'], price: '面议', badge: 'HOT', color: '#7c3aed', url: 'https://qm.qq.com/q/jx37nUpcBy' },
        { id: 'crossversion', icon: 'fa-solid fa-copy', name: '全版本存档互通', subtitle: 'CROSS-VERSION MIGRATION', desc: '专业的 Minecraft 存档转换服务，实现Java/中国版/基岩版各版本间存档互通，让你的建筑跨越版本限制。', features: ['基岩版转Java版', 'Java版转基岩版', '版本升级降级', '中国版存档导入导出'], price: '¥18 ', badge: 'HOT', color: '#f59e0b', url: 'https://docs.qq.com/doc/DVmhJQ3VLWWVzbHZH' },
        { id: 'pixel', icon: 'fa-solid fa-paintbrush', name: '拼豆像素画图纸', subtitle: 'PIXEL ART BLUEPRINT', desc: '承接拼豆板52钉及以下尺寸图纸定制，可根据MC皮肤设计大头拼豆图纸，含双层差分及合成，附带详细制作说明。', features: ['像素拼豆图纸', '调色板优化', '皮肤设计拼豆图纸', '制作教程附带'], price: '¥10 起', badge: 'UNIQUE', color: '#10b981', url: 'https://qm.qq.com/q/jx37nUpcBy' },
        { id: 'vocaloid', icon: 'fa-solid fa-music', name: 'Vocaloid 音乐企划', subtitle: 'VOCALOID PROJECT', desc: 'Vocaloid 相关音乐创作企划，涵盖原创/同人填词创作与调音制作，用虚拟歌声演绎独特音乐故事。【需自带调音引擎】', features: ['原创填词创作', 'Vocaloid 调音', '同人曲改编', '原创音乐作词'], price: '面议', badge: 'UNIQUE', color: '#06b6d4', url: 'https://space.bilibili.com/1327449089' }
    ];

    var WORKS = {
        buildings: [
            { id: 'beijingzijincheng', title: '北京明紫禁城', subtitle: 'the Forbidden City', category: '古建筑组 · 尚国营建', desc: '比例还原北京明代紫禁城，包含奉天殿、谨身殿等主要建筑群，气势恢宏，工笔细腻，每一处斗拱飞檐都经精心考据。', tags: ['#尚国营建', '#宫殿', '#大型建筑'], icon: 'fa-chess-rook', image: 'images/beijingzijincheng.webp', author: '浔昇' },
            { id: 'datongyungangjichang', title: '大同云冈机场', subtitle: 'Datong Yungang Airport', category: '现代建筑 · 云筑设计团队', desc: '本地图参考现实原型山西省大同市云冈国际机场（Datong Yungang International Airport，IATA：DAT，ICAO：ZBDT），为4C级国际支线机场。', tags: ['#云筑设计团队', '#现代', '#交通'], icon: 'fa-plane', image: 'images/datongyungangjichang.webp', author: 'HOYSH、小熊熊' },
            { id: 'reserved-building-1', title: '长安唐大明宫', subtitle: 'Daming Palace', category: '古建筑组 · 尚国营建', desc: '完整还原长安唐代大明宫，大明宫，大唐帝国的大朝正宫，唐朝的政治中心和国家象征，位于唐京师长安（今西安）北侧的龙首原，是唐长安城三座主要宫殿“三大内”（大明宫、太极宫、兴庆宫）中规模最大的一座。', tags: ['#尚国营建', '#宫殿', '#唐宋'], icon: 'fa-hammer', image: 'images/daminggong.webp', author: '浔昇' },
            { id: 'reserved-building-2', title: '兰茶市6 · 古韵银江', subtitle: 'LACH City 6', category: '现代城市 · SHV团队', desc: '兰茶市是基于架空城市的基础上创作的一个拥有烟火气的小城，拥有丰富的地铁的线路、场景与彩蛋，近年来逐步更新，得到了很多MC中国版玩家的喜爱。', tags: ['#现代都市', '#架空', '#SHV团队'], icon: 'fa-city', image: 'images/lach.webp', author: 'SHV寻林' },
            { id: 'reserved-building-3', title: '明清风格明堂', subtitle: 'Ming and Qing style Mingtang', category: '古建筑组 · 明清建筑', desc: '原型参考武则天时期洛阳城核心建筑万象神宫（明堂），保留”上圆下方、三重通天”的核心形制，经体量缩放与明清风格化重构，用方块还原了一座兼具唐代格局与明清细节的中式建筑大观。', tags: ['#古建筑', '#明清', '#明堂'], icon: 'fa-hammer', image: 'images/mingtang.webp', isReserved: false, author: '亨升' },
            { id: 'reserved-building-4', title: '希伦市', subtitle: 'Hilom City', category: '现代城市 · 云筑设计团队', desc: '希伦市是一座历经四代迭新、以现代都市为蓝本打造的架空城市，融合商业中心、交通枢纽与滨水景观，细节丰富布局考究，是云筑设计团队的又一力作。', tags: ['#现代都市', '#架空', '#云筑设计'], icon: 'fa-city', image: 'images/xls.webp', author: 'HOYSH' },
            { id: 'tiananmenguangchang', title: '北京天安门广场', subtitle: 'Tiananmen Square', category: '古建筑组 · 红色建筑', desc: '以方块按比例还原北京天安门广场，涵盖天安门城楼、人民英雄纪念碑、人民大会堂与国家博物馆等标志性建筑。广场中轴对称、气势磅礴，城楼红墙金瓦，是新中国形象的经典地标，也是明清古建与宏大城市规划相结合的匠心之作。', tags: ['#地标', '#广场', '#明清'], icon: 'fa-monument', image: 'images/tam.webp', author: '亨升' }
        ],
        maps: [
            { id: 'reserved-map-1', title: '杀戮迷宫', subtitle: 'Killing Labyrinth', category: '玩法地图 · 多人竞技', desc: '石砖构筑的巨大迷宫纵横交错，曲折通道暗藏杀机。踏入这片迷域，前路难辨方向，敌人潜伏拐角，唯有奋力厮杀，寻得出路方能存活。', tags: ['#多人对战', '#单人竞技', '#联机玩法'], icon: 'fa-map', image: 'images/slmg.webp', author: '挽留' },
            { id: 'reserved-map-2', title: '幻梦层层系列', subtitle: 'Layers of Illusion', category: '玩法地图 · 剧情解谜', desc: '聊无意义的生活，疲惫无力的身躯，阴冷晦暗的盛夏，幻梦层层的思维。在剧情里探寻"我"究竟是谁。', tags: ['#剧情', '#解密', '#闯关'], icon: 'fa-map', image: 'images/hmcc.webp', author: 'SFL 2023&2024地图立项组' },
            { id: 'reserved-map-3', title: '末日之后', subtitle: 'After the Doomsday', category: '玩法地图 · 多人竞技', desc: '一款PVE类型的地图，内置指令抽奖系统，击败怪物可获得奖励；地图内隐藏奖励宝箱，定时刷新物资。', tags: ['#多人协作', '#PVE', '#冒险'], icon: 'fa-map', image: 'images/mrzh.webp', author: '挽留' },
            { id: 'reserved-map-4', title: '多赛道冰船竞技', subtitle: 'Multi-track ice boat competition', category: '玩法地图 · 多人竞技', desc: '2023年新年企划--在我的世界Minecraft里冰与船的特性中展开联想性创作，拥有美观的建筑以及有两个赛道，一个较易另一个较难，可以在第一个赛道中熟练之后再挑战更难的，突破自己。', tags: ['#竞技', '#冰船', '#新年'], icon: 'fa-map', image: 'images/bcjj.webp', author: '空空' },
            { id: 'reserved-map-5', title: '2026 · SFL春节联欢晚会现场', subtitle: '2026 · SFL Spring Festival Square', category: '玩法地图 · 活动会场', desc: '该地图为2026年极鱼社 · 尚国营建 · HG Studio 元旦、除夕两届联欢晚会的活动现场，内设主殿大厅、花田、山地建筑群等多处场景，二十余人在此展开了别开生面的线上晚会活动。地图目前公开于网易MC资源大厅供玩家游览。', tags: ['#晚会', '#活动', '#会场'], icon: 'fa-map', image: 'images/xn.webp', author: '浔昇、浩歌' }
        ],
        addons: [
            { id: 'binfentangzixingche', title: '缤纷糖自行车', subtitle: 'Candy Bike Addon', category: 'Addon · 载具', desc: '糖果主题自行车载具，缤纷色彩搭配多种皮肤，拥有完整的骑行动画和机制，让你的MC世界充满甜蜜与活力。', layout: 'wide', tags: ['#载具', '#Addon', '#可爱'], icon: 'fa-bicycle', image: 'images/binfentangzixingche.webp', author: '元谋YUMI' },
            { id: 'fugukehuanzaijubao', title: '复古科幻载具包', subtitle: 'Retro Sci-Fi Vehicles', category: 'Addon · 载具包', desc: '资源包包含3辆核动力驱动的科幻载具，造型设计起源于50年代，代表人们对未来的向往和幻想。部分车辆有背景音乐，车子有两百点血量。', layout: 'wide', tags: ['#载具', '#科幻', '#Addon'], icon: 'fa-rocket', image: 'images/fugukehuanzaijubao.webp', author: 'Kino' },
            { id: 'reserved-addon-1', title: '中式家具 · 正式版', subtitle: 'Chinese Style Furniture', category: 'Addon · 家具', desc: '模组新增十余款精致中式古风家具，包含桌椅、屏风、灯笼、花窗等摆件，打造古韵内饰，轻松搭建国风宅院。', layout: 'landscape', tags: ['#中式', '#家具', '#装饰'], icon: 'fa-gears', image: 'images/zsjj.webp', author: '浔昇' },
            { id: 'reserved-addon-4', title: '【像素拼豆】Mard全系291色建筑方块拓展包', subtitle: ' Mard Full Series 291-Color Building Block Expansion Pack', category: 'Addon · 建筑拓展', desc: '以 Mard 拼豆全套 291 色标准色谱为灵感 1:1 复刻，新增 15 大类色号合计 291 款纯色方块，彻底填补原版色彩空白；支持聊天栏输入色号一键获取、批量多重取件，内附说明书与图纸，适配像素画、彩绘、造景等全部建造场景。', layout: 'landscape', tags: ['#像素', '#拼豆', '#内置内容'], icon: 'fa-gears', image: 'images/pd.webp', author: '元谋YUMI' },
            { id: 'tdsw', title: '头顶生物', subtitle: 'Head-top Creatures', category: 'Addon · 生物随宠', desc: '以「原版生物头顶随宠」为创作灵感，新增四十余种涵盖动物、敌对生物、水生生物的头顶随宠，均拥有独立动画与专属机制：装配水系生物可获水下呼吸，装配敌对生物可提升血量上限或附加空手火焰，还可解锁层层叠叠的「套娃玩法」。所有随宠均支持生存合成，填补原版生存的陪伴空白。', layout: 'wide', tags: ['#可爱', '#真实', '#陪伴'], icon: 'fa-frog', image: 'images/tdsw.webp', author: '元谋YUMI' },
            { id: 'reserved-addon-3', title: '元宵花灯', subtitle: 'Yuanxiao Lantern', category: 'Addon · 装饰', desc: '新增数十款款国风元宵花灯！梅兰竹菊、牡丹纹样一应俱全。精致立体模型，流苏飘逸，装点古风庭院、古镇街巷，灯火盈盈，为你的世界增添浓浓中式佳节氛围。', layout: 'square', tags: ['#中式', '#装饰', '#摆件'], icon: 'fa-gears', image: 'images/huadeng.webp', author: '浔昇' },
            { id: 'reserved-addon-2', title: '唱片型音乐播放器- 路灯原创音乐包', subtitle: 'Ludeng Original Music Pack', category: 'Addon · 唱片音乐包', desc: 'SFL与R.A.D Music Club联手推出的唱片音乐模组，新增8首原创曲目，30格内可立体听音，音频均拥有完整版权，生存模式即可制作播放器，拥有独立歌词本可对照。', layout: 'landscape', tags: ['#原创', '#音乐', '#播放器'], icon: 'fa-gears', image: 'images/ld.webp', author: 'A_路灯、元谋YUMI' },
            { id: 'yuanbanshengwuqicheng', title: '更好的原版生物可骑乘', subtitle: 'Original version of creature mountable', category: 'Addon · 生物增强', desc: '原版全部生物新增驯化骑乘属性，骑乘任意你喜欢的生物遨游世界，甚至在夜幕降临时骑乘幻翼遨游天空，部分生物还有物品栏属性哦！', layout: 'landscape', tags: ['#生物', '#生存', '#Addon'], icon: 'fa-dragon', image: 'images/yuanbanshengwuqicheng.webp', author: '元谋YUMI' },
            { id: 'paopaochuan', title: '泡泡船', subtitle: 'Bubble Boat', category: 'Addon · 载具', desc: '以动漫海绵宝宝为创意打造的可爱海洋主题小船，可在水面自由航行，产生泡泡粒子效果，冒险必备萌系载具。', layout: 'landscape', tags: ['#载具', '#Addon', '#海洋'], icon: 'fa-ship', image: 'images/paopaochuan.webp', author: '元谋YUMI' },
            { id: 'reserved-addon-5', title: '灯火璀璨 - 元宵', subtitle: 'Bright Lights - Yuanxiao', category: 'Addon · 装饰', desc: '极鱼社2025元宵主题组件！多款复古传统花灯各具特色，匠心还原中式古灯造型。悬于长街楼阁，星火点点，在方块世界重现上元灯会的繁华盛景。', layout: 'landscape', tags: ['#节日', '#元宵', '#拓展'], icon: 'fa-gears', image: 'images/dhcc.webp', author: '浔昇、元谋YUMI' },
            { id: 'reserved-addon-6', title: '更多精细人模盔甲架', subtitle: 'More detailed human model armor stands', category: 'Addon · 角色', desc: '升级优化盔甲架模型，拥有生动人形外观。自由摆放姿态，陈列武器、套装，用于展厅布景、商铺装饰，打造精致方块场景。', layout: 'square', tags: ['#角色', '#美化', '#真实'], icon: 'fa-gears', image: 'images/kjj.webp', author: 'SFL皮肤组、元谋YUMI' }
        ],
        skins: [
            { id: 'skin-1', title: '海月生烟', author: '沐_玖儿', category: '日常风', image: 'images/skin-1.webp' },
            { id: 'skin-2', title: '呆萌挽挽', author: '甜妤', category: '萌系风', image: 'images/skin-2.webp' },
            { id: 'skin-3', title: '瑶台飞花', author: '元谋YUMI', category: '日常风', image: 'images/skin-3.webp' },
            { id: 'skin-4', title: '叠彩玫心酱', author: '沐_玖儿', category: '萌系风', image: 'images/skin-4.webp' },
            { id: 'skin-5', title: '雨中赏花', author: '残缺', category: '萌系风', image: 'images/skin-5.webp' },
            { id: 'skin-6', title: '小沄子﹣男版', author: '小沄子', category: '限定款', image: 'images/skin-6.webp' },
            { id: 'skin-7', title: '松饼枫糖浆', author: '甜妤', category: '可爱风', image: 'images/skin-7.webp' },
            { id: 'skin-8', title: '苏里', author: 'by_E', category: '复古风', image: 'images/skin-8.webp' },
            { id: 'skin-9', title: '雨息', author: '陌笙', category: '萌系风', image: 'images/skin-9.webp' },
            { id: 'skin-10', title: '玲玲小姐姐', author: '元初', category: '搞怪风', image: 'images/skin-10.webp' },
            { id: 'skin-11', title: '唐 - 仕女', author: '浔昇', category: '古风', image: 'images/skin-11.webp' },
            { id: 'skin-12', title: '余晖', author: '残缺', category: '萌系风', image: 'images/skin-12.webp' },
            { id: 'skin-13', title: '北笙&南笺', author: 'SFL皮肤组', category: '姐妹款', image: 'images/skin-13.webp' },
            { id: 'skin-14', title: '浔昇休闲装', author: '浔昇', category: '日常风', image: 'images/skin-15.webp' },
            { id: 'skin-15', title: '小源', author: '元谋YUMI', category: '萌系风', image: 'images/skin-14.webp' }
        ]
    };

    var PLATFORMS = [
        { name: '我的世界中国版', type: '游戏平台', url: 'https://mc.163.com/pe/startup/?id=netease&param=%7B%22from%22%3A%20%22profileTeam%22%2C%20%22id%22%3A%20%221627555615%22%7D', icon: 'fa-solid fa-cube', color: '#00d4ff' },
        { name: '爱发电', type: '创作者平台', url: 'https://www.ifdian.net/a/xunsheng208322', icon: 'fa-solid fa-heart', color: '#f59e0b' },
        { name: 'B站 / 哔哩哔哩', type: '视频平台', url: 'https://b23.tv/EbGndlr', icon: 'fa-brands fa-bilibili', color: '#fb7299' },
        { name: '抖音', type: '短视频', url: 'https://v.douyin.com/fShFwLzAsEg', icon: 'fa-brands fa-tiktok', color: '#111111' },
        { name: 'QQ社群', type: '社群平台', url: 'https://qm.qq.com/q/l5Tb5HeLss', icon: 'fa-brands fa-qq', color: '#12b7f5' },
        { name: '小红书', type: '社交平台', url: 'https://xhslink.cn/m/AP2A6xnfUQW', icon: 'fa-solid fa-book-open', color: '#ff2442' },
    ];

    var MEMBERS = [
        { name: '元谋YUMI', role: '团队负责人 / 运营 / Addon作者 / 地图指令 / 画师 / 策划 / 编辑', desc: '团队负责人，负责策略规划与资源对接，是MC中国版多款热门模组的开发者，部分免费模组的下载量超过100w，同时是音乐人和vocaloid领域的创作者。', avatar: 'fa-solid fa-crown', color: '#f59e0b', image: 'images/ym.webp', links: [{ name: 'B站', icon: 'fa-brands fa-bilibili', url: 'https://b23.tv/tK9lhP5', class: 'bilibili' }, { name: '抖音', icon: 'fa-brands fa-tiktok', url: 'https://v.douyin.com/pWj7jEfEBwQ/', class: 'douyin' }] },
        { name: '浔昇-SFL🐟', role: '团队负责人 / 尚国营建负责人 / 建筑作者 / Addon作者 / 画师 / 策划', desc: '浔昇是团队负责人及团队古建筑设计总监，擅长唐、宋、明、清的多体制和风格古建筑建造，还是才华横溢的贴图画师，代表作品众多。', avatar: 'fa-solid fa-chess-rook', color: '#8b5cf6', image: 'images/xs.webp', links: [{ name: 'B站', icon: 'fa-brands fa-bilibili', url: 'https://b23.tv/ZFCrkKc', class: 'bilibili' }, { name: '抖音', icon: 'fa-brands fa-tiktok', url: 'https://v.douyin.com/E6XRgab3btM/', class: 'douyin' }] },
        { name: '浩歌', role: 'HG Studio 负责人 / 建筑作者', desc: '浩歌是现代建筑设计总监，擅长科幻都市风格的建筑大观创作，浩歌的个人开发者账号：HG2025。', avatar: 'fa-solid fa-city', color: '#0ea5e9', image: 'images/hg.webp' },
        { name: '翎汐RingShi', role: 'SFL首席筑梦师 / 社群运营 / 自媒体运营', desc: '“笑裁青丝绣彩霓，怀拥妙笔字珠玑。自生芳华化翎羽，长守清心待春汐。” \n翎汐是SFL社团原创虚拟形象，生日6月8日，作为团队首席筑梦师，总会在大家没有灵感的时候出面解决问题；同时作为虚拟形象对外展示社团风采。', avatar: 'fa-solid fa-palette', color: '#ec4899', image: 'images/lx.webp' },
        { name: '元初', role: '社群运营 / 皮肤画师', desc: '元初不但擅长MC皮肤绘制，还擅长指绘，他的风格多样，在多个平台都得到了很多人的喜爱。同时元初和元谋一起完成了多个音mad鬼畜企划，负责视频剪辑工作。', avatar: 'fa-solid fa-microchip', color: '#10b981', image: 'images/yc.webp' },
        { name: '空空', role: '建筑作者 / 玩法地图作者 / 建筑策划', desc: '空空擅长现代风、中世纪风的建筑创作，参与了团队组织多个地图立项的活动。', avatar: 'fa-solid fa-paint-brush', color: '#ef4444', image: 'images/kk.webp' },
        { name: '小源', role: '剪辑师', desc: '小源是团队视频剪辑师，独立运营多个万粉抖音账号，拥有丰富的新媒体运营与短视频内容创作经验，擅长捕捉热点打造爆款视频。', avatar: 'fa-solid fa-clapperboard', color: '#6366f1', image: 'images/xy.webp', links: [{ name: '抖音', icon: 'fa-brands fa-tiktok', url: 'https://v.douyin.com/pqT9AG5TlCo/', class: 'douyin' }] },
        { name: '挽留', role: '玩法地图作者 / 指令师', desc: '挽留精通玩法地图的策划与实现落地，打造了《杀戮迷宫》、《末日之后》等多个爆款地图，同时挽留还是经验丰富的指令师，对团队做出了不可磨灭的贡献。', avatar: 'fa-solid fa-user-tie', color: '#06b6d4', image: 'images/wl.webp' },
        { name: '亨升', role: '建筑作者 / 古建筑设计师', desc: '亨升精通明清古建筑风格设计与建造，擅长将历史建筑以方块形式高度还原，代表作品《明清风格明堂》展现了其对古建筑形制的深刻理解与精湛技艺。', avatar: 'fa-solid fa-user', color: '#f59e0b', image: 'images/hs.webp' },
        { name: '残缺', role: '皮肤作者 / 常稿画师', desc: '残缺(雨中观花)是一位才华横溢的皮肤画师，她擅长多种风格的MC皮肤贴图绘制。作为团队的常稿画师，受到广泛好评。', avatar: 'fa-solid fa-clipboard-check', color: '#84cc16', image: 'images/cq.webp' },
        { name: '甜妤', role: '皮肤作者', desc: '甜妤的皮肤以精致而被人熟知，她风格多样，发布的作品多个都收获了10w及以上的下载量，得到了广大玩家的喜爱。', avatar: 'fa-solid fa-user', color: '#f43f5e', image: 'images/ty.webp' },
        { name: 'by_E', role: '皮肤作者 / 常稿画师', desc: 'by_E擅长绘制二次元同人皮肤，他专注于将动漫、漫画中的角色高度还原至MC世界，笔触细腻风格鲜明。', avatar: 'fa-solid fa-user', color: '#8b5cf6', image: 'images/by.webp' },
        { name: 'a_12', role: '社群运营', desc: 'a_12负责团队社群日常运营与玩家互动，活跃于QQ群、频道等多个社群渠道，热忱解答玩家疑问，维护社群氛围，是团队与玩家之间的重要桥梁。', avatar: 'fa-solid fa-user', color: '#06b6d4', image: 'images/a12.webp' },
        { name: '苦芒', role: '前社团开平运营', desc: '苦芒是前社团开平运营。', avatar: 'fa-solid fa-user', color: '#f59e0b', image: 'images/km.webp' },
        { name: 'kino', role: 'Addon作者 / 建模师', desc: 'kino_noikce是一位优秀的建模师，他擅长将头脑中的创意转变为实际，尤其擅长创作汽车模型和科幻风格配件的3D设计，代表作品《复古科幻载具包》深受玩家喜爱。', avatar: 'fa-solid fa-user', color: '#8b5cf6', image: 'images/kn.webp' },
        { name: '陌笙', role: '皮肤作者 / 常稿画师', desc: '陌笙是一位优秀的皮肤创作者，擅长休闲简约风格的皮肤绘制与配色，作品清新自然、广受好评。陌笙的个人开发者：哲是个工作室。', avatar: 'fa-solid fa-user', color: '#f43f5e', image: 'images/ms.webp' }
    ];

    var SHOP_ITEMS = [
        { title: '北京明紫禁城地图存档1.21及以上版本通用', category: '建筑存档', price: '¥45', original: '¥69.9', icon: 'fa-user-ninja', desc: '1:1还原北京明代紫禁城建筑群', tag: '热销', tagColor: '#ef4444', image: 'images/sp1.webp' },
        { title: '【像素拼豆】 MC物品全图鉴拼豆图纸', category: '图纸包', price: '¥17.99', original: '¥19.9', icon: 'fa-chess-rook', desc: '人工识色、原创手绘MC物品拼豆图纸包', tag: '限时', tagColor: '#f59e0b', image: 'images/sp2.webp' },
        { title: '长安唐大明宫地图存档1.21及以上版本通用', category: '建筑存档', price: '¥89', original: '¥119.9', icon: 'fa-gears', desc: '1:1还原唐代大明宫建筑群，气势恢宏的宫殿存档', tag: '新品', tagColor: '#10b981', image: 'images/sp3.webp' },
        { title: '明清风格明堂', category: '建筑存档', price: '¥13', original: '¥29.9', icon: 'fa-cubes', desc: '基于武则天时期洛阳城万象神宫（明堂）重构的明清风古建', tag: '超值', tagColor: '#8b5cf6', image: 'images/sp4.webp' },
        { title: 'Mard全系291色建筑方块拓展包', category: '新品Addon', price: '¥3.6', original: '¥6', icon: 'fa-tree', desc: '以Mard拼豆色谱为灵感1:1复刻，覆盖15大类291款纯色方块，弥补原版色彩空白；支持聊天栏输入色号一键取块、空格分隔批量调取，内置对照图纸与说明书，像素画、彩绘、造景全覆盖。', tag: '必备', tagColor: '#06b6d4', image: 'images/sp5.webp' },
        { title: '北宋皇家道观地图存档1.21及以上版本通用', category: '建筑存档', price: '¥35', original: '¥58', icon: 'fa-city', desc: '宋风皇家道观建筑群存档，庄重典雅的宗教建筑大观，适配生存与创造模式', tag: '推荐', tagColor: '#0ea5e9', image: 'images/sp6.webp' }
    ];

    var PARTNERS = [
        { name: '上海熵联天创网络科技有限公司', en: 'Entropy Link Tianchuang', type: '合作组织', desc: '熵联天创，游戏开发团队，成立于2025年6月18日，致力于制作有趣好玩的作品，营造良好的团队环境。代表作品《邻家之钥》。是极鱼社战略合作伙伴。', url: 'https://tianentropy.cn/', color: '#f59e0b', logo: 'fa-solid fa-chess-rook', image: 'images/tpy.webp' },
        { name: 'MewBaka笨猫工作室', en: 'MewBaka Studio', type: '合作组织', desc: 'MewBaka笨猫工作室，成立于2024年7月。主要开发视觉小说游戏及开发产品。现正制作一款为视觉小说创作打造的现代游戏引擎——NarraLeaf Project。', url: 'https://www.mewbaka.cn/', color: '#f97316', logo: 'fa-solid fa-cat', image: 'images/mewbaka.webp' },
        { name: '宙鱼文化工作室', en: 'Zhouyu Culture Studio', type: '合作组织', desc: '宙鱼网络工作室，成立于2020年6月，至今旗下三名直属开发者，两名合作开发者，总发表组件450+，专业与广告设计、新媒体运营、文创宣发等 咨询联系:CBUAD@qq.com。', url: 'https://cbuad.net/', color: '#0ea5e9', logo: 'fa-solid fa-city', image: 'images/cnzy.webp' },
        { name: 'Realize a Dream Music Club', en: 'R.A.D Music Club', type: '创作联盟', desc: 'R.A.D. Music Club是一家立足于全球视野、面向未来的音乐团队，与极鱼社联手创作原创歌曲。', url: 'https://space.bilibili.com/105791477', color: '#ec4899', logo: 'fa-solid fa-palette', image: 'images/radlogo.webp' },
        { name: '云筑设计团队', en: 'Cloud Pavilion Work', type: '建筑团队', desc: '云筑设计团队由HOYSH创立，成立于2026年3月12日，主营现代式建筑，代表作：《天宗市》《希伦市》《像素大同系列》《像素深圳》', url: 'https://v.douyin.com/8_n7XMWClPc/', color: '#8b5cf6', logo: 'fa-solid fa-microchip', image: 'images/yzlogo.webp' },
        { name: '雨夜街水泥钟表', en: 'Rain Water', type: '合作组织', desc: '雨夜街水泥钟表（雨夜街）成立于2025年6月8日，以文字设计为核心业务，理念是“梦想优先，创作自由”。目前雨夜街的主要方向是ACG文字冒险类游戏。', url: '#', color: '#5b9bd5', logo: 'fa-solid fa-clock', image: 'images/yyj.webp' }    ];

    var FRIEND_LINKS = [
        { name: '上海熵联天创', url: 'https://tianentropy.cn/', desc: '独立游戏开发团队', icon: 'fa-solid fa-gamepad', color: '#f59e0b' },
        { name: 'MewBaka笨猫工作室', url: 'https://www.mewbaka.cn/', desc: '视觉小说游戏引擎开发', icon: 'fa-solid fa-cat', color: '#f97316' },
        { name: '宙鱼文化工作室', url: 'https://cbuad.net/', desc: '新媒体运营与文创宣发', icon: 'fa-solid fa-city', color: '#0ea5e9' },
        { name: 'R.A.D Music Club', url: 'https://space.bilibili.com/105791477', desc: '全球视野音乐团队', icon: 'fa-solid fa-music', color: '#ec4899' },
        { name: '云筑设计团队', url: 'https://v.douyin.com/8_n7XMWClPc/', desc: '现代式建筑团队', icon: 'fa-solid fa-building', color: '#8b5cf6' },
        { name: '雨夜街水泥钟表', url: '#', desc: '文字设计与文字冒险游戏', icon: 'fa-solid fa-clock', color: '#5b9bd5' }    ];

    function getNavbar(activePage) {
        var isSubPage = activePage === 'partners';
        var links = [
            { href: isSubPage ? 'index.html#hero'     : '#hero',     label: '主页',     key: 'hero' },
            { href: isSubPage ? 'index.html#works'    : '#works',    label: '代表作品', key: 'works' },
            { href: isSubPage ? 'index.html#services' : '#services', label: '业务服务', key: 'services' },
            { href: isSubPage ? 'index.html#shop'     : '#shop',     label: '在售资源', key: 'shop' },
            { href: isSubPage ? 'index.html#members'  : '#members',  label: '成员列表', key: 'members' },
            { href: isSubPage ? 'index.html#join'     : '#join',     label: '加入我们', key: 'join' },
            { href: 'partners.html', label: '合作伙伴', key: 'partners' },
            { href: 'https://data.swiftfishlab.cn', label: '上架数据', key: 'data', external: true }
        ];
        var navItems = links.map(function (l) {
            return '<li><a href="' + l.href + '" class="nav-link ' + (l.key === activePage ? 'active' : '') + '"' +
                (l.external ? ' target="_blank" rel="noopener"' : '') +
                ' data-nav="' + l.key + '">' + l.label + '</a></li>';
        }).join('');

        var logoHref = isSubPage ? 'index.html#hero' : '#hero';

        return '' +
            '<nav class="navbar" id="navbar">' +
            '  <div class="nav-container">' +
            '    <a href="' + logoHref + '" class="nav-logo">' +
            '      <img src="images/sfllogo.webp" alt="' + SITE.name + '" class="logo-img">' +
            '    </a>' +
            '    <ul class="nav-menu" id="navMenu">' + navItems + '</ul>' +
            '    <button class="nav-toggle" id="navToggle" aria-label="菜单" aria-expanded="false">' +
            '      <span></span><span></span><span></span>' +
            '    </button>' +
            '  </div>' +
            '  <div class="nav-overlay" id="navOverlay"></div>' +
            '</nav>';
    }

    function getFooter() {
        var platformLinks = PLATFORMS.map(function (p) {
            return '<a href="' + p.url + '" class="social-link" style="border-color:' + p.color + '40;color:' + p.color + '" title="' + p.name + '" target="_blank" rel="noopener"><i class="' + p.icon + '"></i></a>';
        }).join('');

        var friendLinksHtml = FRIEND_LINKS.map(function (f) {
            return '<a href="' + f.url + '" class="friend-link-item" target="_blank" rel="noopener">' + f.name + '</a>';
        }).join('');

        return '' +
            '<footer class="footer">' +
            '  <div class="container">' +
            '    <div class="footer-main">' +
            '      <div class="footer-brand">' +
            '        <div class="footer-logo"><img src="images/sfllogo.webp" alt="' + SITE.name + ' Logo" class="logo-img"></div>' +
            '        <h3>' + SITE.name + '</h3>' +
            '        <p class="footer-en">' + SITE.en + '</p>' +
            '        <p class="footer-desc">' + SITE.desc + '<br>皮肤、建筑、Addon 与资源定制</p>' +
            '        <div class="footer-socials">' + platformLinks + '</div>' +
            '      </div>' +
            '      <div class="footer-nav"><h4>快速导航</h4><ul>' +
            '<li><a href="#works">代表作品</a></li>' +
            '<li><a href="#services">业务服务</a></li>' +
            '<li><a href="#shop">在售资源</a></li>' +
            '<li><a href="#members">成员列表</a></li>' +
            '<li><a href="#join">加入与反馈</a></li>' +
            '<li><a href="partners.html">合作伙伴</a></li>' +
            '<li><a href="https://data.swiftfishlab.cn" target="_blank" rel="noopener">上架数据</a></li>' +
            '</ul></div>' +
            '      <div class="footer-contact"><h4>联系方式</h4>' +
            '        <div class="contact-item"><i class="fa-solid fa-users"></i><div><span>交流群</span><a href="' + SITE.qq.chatUrl + '" target="_blank" rel="noopener">' + SITE.qq.chat + '</a></div></div>' +
            '        <div class="contact-item"><i class="fa-solid fa-user-plus"></i><div><span>负责人 QQ 1</span><a href="' + SITE.qq.join1Url + '" target="_blank" rel="noopener">' + SITE.qq.join1 + '</a></div></div>' +
            '        <div class="contact-item"><i class="fa-solid fa-user-plus"></i><div><span>负责人 QQ 2</span><a href="#" onclick="copyText(\'' + SITE.qq.join2 + '\');return false;">' + SITE.qq.join2 + '</a></div></div>' +
            '      </div>' +
            '      <div class="footer-friendlinks"><h4>友情链接</h4><div class="friend-links">' + friendLinksHtml + '</div></div>' +
            '    </div>' +
            '    <div class="footer-bottom"><p>© 2021–2026 ' + SITE.name + ' ' + SITE.en + '. All Rights Reserved.</p><p>本网站与 Mojang AB 及网易公司无关。' + SITE.desc + '</p></div>' +
            '  </div>' +
            '</footer>' +
            '<button class="back-to-top" id="backToTop" aria-label="返回顶部"><i class="fa-solid fa-arrow-up"></i></button>' +
            '<div class="toast" id="toast"></div>';
    }

    function injectLayout(activePage) {
        // 静态 HTML 中已内置导航/页脚时不再重复注入，避免内容重复
        if (!document.getElementById('navbar')) {
            document.body.insertAdjacentHTML('afterbegin', getNavbar(activePage));
        }
        if (!document.querySelector('footer.footer')) {
            document.body.insertAdjacentHTML('beforeend', getFooter());
        }
    }

    global.SITE_DATA = { SITE: SITE, SERVICES: SERVICES, WORKS: WORKS, PLATFORMS: PLATFORMS, MEMBERS: MEMBERS, SHOP_ITEMS: SHOP_ITEMS, PARTNERS: PARTNERS, FRIEND_LINKS: FRIEND_LINKS };
    global.injectLayout = injectLayout;
})(window);
