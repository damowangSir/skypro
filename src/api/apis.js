import axios from "axios"
// 设置服务器IP地址
axios.defaults.baseURL="http://127.0.0.1:5000"

// API：登录
// account：账号
// password:密码
export const API_LOGIN = (account,password)=>axios.post("/users/checkLogin",{account,password})
// ===============================账号管理==========================================================
// 添加账号
// account：账号
// password:密码
// userGroup:用户组
export const API_USER_ADD = (account,password,userGroup)=>axios.post("/users/add",{account,password,userGroup})

// 账号列表
// currentPage：当前页码
// pageSize：每页条数
export const API_USER_LIST = (currentPage,pageSize)=>axios.get("/users/list",{params: {currentPage,pageSize}})

// 删除账号
// id：要删除账号的id
export const API_USER_DEL = (id)=>axios.get('/users/del',{params:{id}})

// 批量删除账号
// ids:要删除的所有账号的id 
export const API_USERS_BAT = (ids)=>axios.get("/users/batchdel",{params:{ids}})


// 修改账号
// id 要修改账号的id
// account 账号
// userGroup 用户组 
export const API_USERS_EDIT = (id,account,userGroup)=>axios.post('/users/edit',{id,account,userGroup})

// 验证原密码
// oldPwd 旧密码  
// id 帐号id
export const API_USERS_CHECKOLDPWD = (oldPwd,id)=>axios.get('/users/checkoldpwd',{params:{oldPwd,id}})

// 修改密码
// newPwd 新密码
// id 帐号id  
export const API_USERS_EDITPWD = (newPwd,id)=>axios.post('/users/editpwd',{newPwd,id})

// 个人中心信息
// id 账号id  
export const API_USERS_ACCINFO = (id)=>axios.get('/users/accountinfo',{params:{id}})

// 头像上传

// 11. 验证token是否过期
// token 令牌 
export const API_USERS_CKECKTOKEN = (token)=>axios.get('/users/checktoken',{params:{token}})
// =============================================商品管理======================================================
// 12. 添加分类
// cateName：分类名称 
// state 是否启用
export const API_GOODS_ACCCATE = (cateName,state)=>axios.post('/goods/addcate',{cateName,state})

// 13 获取分类 
// currentPage 当前页
// pageSize 每页条数
export const API_GOODS_CATELIST = (currentPage,pageSize)=>axios.get('/goods/catelist',{params:{currentPage,pageSize}})

// 14 删除分类
// id 分类id 
export const API_GOODS_DELCATE = (id)=>axios.get('/goods/delcate',{params:{id}})

// 15 编辑分类
// id  分类id 
// cateName 分类名称  
// state  分类状态
export const API_GOODS_EDITCATE = (id,cateName,state)=>axios.post('/goods/editcate',{id,cateName,state})

// 16. 查询所有分类名称
// /goods/categories
export const API_GOODS_CATEGORICE = ()=>axios.get('/goods/categories',{params:{}})

// 18. 添加商品
// name 商品名称
// category	商品分类
// price 商品价格
// imgUrl 商品图片地址
// goodsDesc 商品描述
export const API_GOODS_ADD = (name,category,price,imgUrl,goodsDesc)=>axios.post('/goods/add',{name,category,price,imgUrl,goodsDesc})

// 19. 获取商品列表
// currentPage 当前页码
// pageSize	每页条数 
export const API_GOODS_LIST = (currentPage,pageSize)=>axios.get('/goods/list',{params:{currentPage,pageSize}})

// 20. 删除商品
// id 商品id 
export const API_GOODS_DEL = (id)=>axios.get('/goods/del',{params:{id}})

// 21. 修改商品
// name 商品名称
// category	商品分类
// price	商品价格
// imgUrl 商品图片地址
// goodsDesc 商品描述
// id 商品ID 
export const API_GOODS_EDIT = (name,category,price,imgUrl,goodsDesc,id)=>axios.post('/goods/edit',{name,category,price,imgUrl,goodsDesc,id})


// =============================================订单管理======================================================
// 22. 获取订单列表
// currentPage	当前页码
// pageSize		每页条数 
export const API_ORDER_LIST = (currentPage,pageSize)=>axios.get('/order/list',{params:{currentPage,pageSize}})

// 23. 查询
// currentPage		当前页码
// pageSize  	    每页条数
// orderNo      	订单号
// consignee    	收货人
// phone	    	手机号
// orderState		订单状态
// date		        时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"]
export const API_ORDER_SEARCH = (currentPage,pageSize,orderNo,consignee,phone,orderState,date)=>axios.get('/order/search',{params:{currentPage,pageSize,orderNo,consignee,phone,orderState,date}})

// 24  获取订单详情 /order/detail
// id 订单id
export const API_ORDER_DETAIL = (id)=>axios.get('/order/detail',{params:{id}})
// 25. 修改订单
// id		        要修改账号的id
// orderNo	    	订单号
// orderTime		下单时间
// phone			电话
// consignee		收货人
// deliverAddress	送货地址
// deliveryTime		送达时间
// remarks		    备注
// orderAmount	    订单金额
// orderState	    订单状态
export const API_ORDER_EDIT = (id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState)=>axios.post('/order/edit',{id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState})


// =============================================店铺管理======================================================
// 26. 获取店铺详情 
export const API_SHOP_INFO = ()=>axios.get('/shop/info',{params:{}})

// 28. 店铺内容修改
// id		店铺id
// name	店铺名称
// bulletin		店铺公告
// avatar		店铺头像
// deliveryPrice	int	是	起送价格
// deliveryTime	int	是	送达时间
// description	string	是	店铺描述
// score	float	是	店铺好评率
// sellCount	int	是	店铺销量
// supports	string数组	是	活动支持 /shop/edit
// date	string数组	是	营业时间
// pics	string数组	是	店铺图片
export const API_SHOP_EDIT = (id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics)=>axios.post('/shop/edit',{id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics})



// 29. 首页报表接口
export const API_ORDER_TOTALDATA = ()=>axios.get('/order/totaldata',{params:{}})

// 30. 订单报表接口 /order/ordertotal
// date		如["2019-10-01 00:00:00", "2019-10-10 00:00:00"]
export const API_ORDER_ORDERTOTAL = (date)=>axios.get('/order/ordertotal',{params:{date}})



