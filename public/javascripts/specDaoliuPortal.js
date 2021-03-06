/*
{
    "code" : 1,
    "data" : [{
            "data1" : {
                "推荐条数为5的总展示量(登录用户)" : 7384,
                "推荐条数为11的总展示量(登录用户)" : 1,
                "推荐条数为12的总展示量(登录用户)" : 263,
                "推荐条数为13的总展示量(登录用户)" : 1465,
                "推荐条数为14的总展示量(登录用户)" : 3538
            },
            "data2" : {
                "量化派-信用钱包" : 12651,
                "读秒" : 12651,
                "拍拍贷" : 12651,
                "卡卡贷" : 12651,
                "我来贷" : 12651,
                "借点钱" : 5267,
                "平安普惠宅e贷" : 5267,
                "钱站" : 5267,
                "功夫贷" : 3655,
                "平安普惠i贷" : 4893,
                "你我金融-极速借" : 5267,
                "维信-星星贷" : 5267,
                "你我贷-嘉英贷" : 5263,
                "你我贷-嘉卡贷" : 5263
            },
            "data3" : {
                "卡卡贷" : 648,
                "量化派-信用钱包" : 1359,
                "拍拍贷" : 855,
                "维信-星星贷" : 98,
                "借点钱" : 471,
                "读秒" : 1385,
                "你我金融-极速借" : 120,
                "你我贷-嘉卡贷" : 99,
                "我来贷" : 752,
                "平安普惠i贷" : 58,
                "功夫贷" : 61,
                "平安普惠宅e贷" : 101,
                "你我贷-嘉英贷" : 73,
                "钱站" : 101
            }
        }
    ]
}
 */


var specDaoliuPortal = Vue.extend({
    template: '#specDaoliuPortal-template',
    data: function() {
        return {
            socket: null,
            okFun: this.getData
        }
    },
    components: {
        'search': search
    },
    created: function() {
        var initSocket = function() {
            this.socket = io('/spec');
            this.socket.on('result', this.onSocketRtn);
            this.socket.on('connect', (data)=>{
                setInterval(()=>{
                    this.socket.emit('heartbeat', '1', (s)=>console.log(s))
                }, 50000)
            });
        }.bind(this);
        
        // socket.io client js后置
        if (document.readyState=='loading')
            document.addEventListener('DOMContentLoaded', initSocket);
        else
            initSocket()
    },
    methods: {
        getData: function(startTime, endTime, project) {
            
            if (!startTime || !endTime || !project) {
                return;
            }
            
            // 展示loading模态
            this.$dispatch && this.$dispatch('showLoading');
            // 发送socket请求
            this.socket.emit('params', {startTime:startTime, endTime:endTime, project:project});
        },
        
        onSocketRtn: function(result) {
            // 关闭loading模态
            this.$dispatch && this.$dispatch('hideLoading');
            
            if (result.code == 1) {
                renderPie(result.data, document.getElementById('spec-chart-main-1'), 'data1');
                renderPie(result.data, document.getElementById('spec-chart-main-2'), 'data2');
                renderPie(result.data, document.getElementById('spec-chart-main-3'), 'data3');
            } else {
                alert(result.msg);
            }
            //socket.disconnect()
            //socket.close()
        }
    }
    
    
    
    
})