export function getPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>日语学习助手</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 16px; }
        h1 { text-align: center; margin-bottom: 16px; color: #333; font-weight: 600; }
        .tabs { display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 16px; overflow-x: auto; }
        .tab { padding: 12px 20px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; color: #666; font-size: 14px; white-space: nowrap; }
        .tab.active { border-bottom-color: #4a90d9; color: #4a90d9; font-weight: 600; }
        .tab:hover { color: #333; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .controls { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .controls select, .controls input { padding: 8px 12px; background: #fff; color: #333; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
        .controls input[type="text"] { flex: 1; min-width: 200px; }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #4a90d9; color: white; }
        .btn-primary:hover { background: #3a7bc8; }
        .btn-success { background: #52c41a; color: white; }
        .btn-success:hover { background: #45a817; }
        .btn-warning { background: #faad14; color: white; }
        .btn-danger { background: #ff4d4f; color: white; }
        .btn-default { background: #f0f0f0; color: #333; border: 1px solid #ddd; }
        .btn-sm { padding: 4px 10px; font-size: 12px; }
        .btn-lg { padding: 12px 24px; font-size: 16px; }
        .card-area { display: flex; align-items: center; justify-content: center; gap: 16px; min-height: 400px; }
        .card-arrow { font-size: 40px; cursor: pointer; color: #999; padding: 10px; user-select: none; }
        .card-arrow:hover { color: #4a90d9; }
        .card-arrow.disabled { opacity: 0.3; pointer-events: none; }
        .card-wrapper { perspective: 1000px; width: 100%; max-width: 400px; min-height: 350px; }
        .card { width: 100%; min-height: 350px; position: relative; transform-style: preserve-3d; transition: transform 0.6s; cursor: pointer; }
        .card.flipped { transform: rotateY(180deg); }
        .card-face { position: absolute; width: 100%; min-height: 350px; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 16px; padding: 30px; }
        .card-front { background: #fff; border: 2px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .card-back { background: #fff; border: 2px solid #4a90d9; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: rotateY(180deg); text-align: left; align-items: flex-start; overflow-y: auto; }
        .card-word { font-size: 56px; font-weight: 700; color: #333; margin-bottom: 12px; text-align: center; }
        .card-level { font-size: 16px; color: #4a90d9; font-weight: 600; }
        .card-hint { font-size: 12px; color: #bbb; margin-top: 24px; }
        .card-count { text-align: center; color: #999; font-size: 13px; margin-bottom: 8px; }
        .card-page { text-align: center; color: #999; font-size: 13px; margin-top: 8px; }
        .no-cards { text-align: center; color: #999; font-size: 16px; padding: 80px; }
        .card-detail { font-size: 14px; line-height: 1.8; width: 100%; }
        .card-detail .row { display: flex; border-bottom: 1px solid #f0f0f0; padding: 6px 0; }
        .card-detail .label { width: 80px; font-weight: 600; color: #666; flex-shrink: 0; }
        .card-detail .value { flex: 1; color: #333; word-break: break-word; }
        .card-back-actions { margin-top: 16px; width: 100%; display: flex; gap: 10px; }
        .card-back-actions .btn { flex: 1; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 8px; overflow: hidden; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; }
        th { background: #fafafa; color: #666; font-weight: 600; font-size: 12px; }
        tr:hover { background: #f9f9f9; }
        .truncate { max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; }
        .badge-success { background: #f0f9ff; color: #52c41a; }
        .badge-secondary { background: #f5f5f5; color: #999; }
        .badge-vocab { background: #e6f7ff; color: #1890ff; }
        .badge-kanji { background: #fff7e6; color: #fa8c16; }
        .badge-manual { background: #f9f0ff; color: #722ed1; }
        .pagination { display: flex; justify-content: center; gap: 10px; margin-top: 16px; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 1000; }
        .modal-content { background: #fff; margin: 60px auto; padding: 24px; border-radius: 12px; max-width: 560px; max-height: 80vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; position: sticky; top: 0; background: #fff; z-index: 10; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .modal-header h3 { color: #333; }
        .close { font-size: 24px; cursor: pointer; color: #999; }
        .detail-table { width: 100%; }
        .detail-table td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
        .detail-table .label { width: 110px; font-weight: 600; color: #666; background: #fafafa; }
        .audio-btn { background: none; border: 1px solid #4a90d9; color: #4a90d9; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .audio-btn:hover { background: #4a90d9; color: #fff; }
        .add-section { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .add-section h3 { margin-bottom: 15px; color: #555; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .add-section .form-group { margin-bottom: 12px; }
        .add-section label { display: block; margin-bottom: 4px; color: #666; font-size: 13px; }
        .add-section input, .add-section select { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
        .lib-word-card { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-top: 12px; }
        .lib-word-card .word { font-size: 28px; font-weight: 600; }
        .lib-word-card .reading { color: #888; margin-top: 4px; }
        .lib-word-card .info { color: #666; font-size: 13px; margin-top: 8px; }
        .lib-word-card .actions { margin-top: 12px; display: flex; gap: 10px; }
        .msg-success { color: #52c41a; padding: 8px 12px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 4px; margin-top: 10px; }
        .msg-error { color: #ff4d4f; padding: 8px 12px; background: #fff2f0; border: 1px solid #ffccc7; border-radius: 4px; margin-top: 10px; }
        .toast { position: fixed; top: 20px; right: 20px; padding: 12px 24px; border-radius: 8px; color: white; z-index: 2000; display: none; font-size: 14px; }
        .toast-success { background: #52c41a; }
        .toast-error { background: #ff4d4f; }
        .loading-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 3000; justify-content: center; align-items: center; }
        .loading-overlay.active { display: flex; }
        .loading-text { color: white; font-size: 18px; background: rgba(0,0,0,0.7); padding: 16px 32px; border-radius: 8px; }
        @media (max-width: 600px) {
            .container { padding: 12px; }
            .card-wrapper { max-width: 100%; }
            .card-word { font-size: 44px; }
            .card-arrow { font-size: 30px; }
            table { font-size: 12px; }
            th, td { padding: 8px 6px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>日语学习助手</h1>
        <div class="tabs">
            <div class="tab active" data-tab="cards">卡牌学习</div>
            <div class="tab" data-tab="manage">词汇管理</div>
            <div class="tab" data-tab="add">添加词汇</div>
        </div>

        <div class="tab-content active" id="cards-content">
            <div class="card-count" id="card-count"></div>
            <div class="card-area" id="card-area"><div class="no-cards">加载中...</div></div>
            <div class="card-page" id="card-page"></div>
        </div>

        <div class="tab-content" id="manage-content">
            <div class="controls">
                <input type="text" id="manage-search" placeholder="搜索单词、读音、释义...">
                <select id="manage-status"><option value="">全部状态</option><option value="0">未学习</option><option value="1">已学习</option></select>
                <select id="manage-level"><option value="">全部等级</option><option value="5">N5</option><option value="4">N4</option><option value="3">N3</option><option value="2">N2</option><option value="1">N1</option></select>
                <select id="manage-type"><option value="">全部类型</option><option value="1">手动输入</option><option value="2">词汇</option><option value="3">汉字</option></select>
                <button class="btn btn-primary" onclick="searchLearning()">查询</button>
            </div>
            <div style="overflow-x: auto;">
                <table><thead><tr><th>单词</th><th>读音</th><th>释义</th><th>等级</th><th>类型</th><th>状态</th><th>详情</th><th>操作</th></tr></thead><tbody id="learning-list"></tbody></table>
            </div>
            <div class="pagination" id="learning-pagination"></div>
        </div>

        <div class="tab-content" id="add-content">
            <div class="add-section">
                <h3>手动输入</h3>
                <div class="form-group"><label>日语单词</label><input type="text" id="manual-word" placeholder="输入日语单词，如：食べる"></div>
                <button class="btn btn-primary" onclick="manualTranslate()">翻译并添加</button>
                <div id="manual-result"></div>
            </div>
            <div class="add-section">
                <h3>从词库获取</h3>
                <div class="controls" style="margin-bottom: 10px;">
                    <select id="lib-type"><option value="">全部类型</option><option value="vocab">词汇</option><option value="kanji">汉字</option></select>
                    <select id="lib-level"><option value="">全部等级</option><option value="5">N5</option><option value="4">N4</option><option value="3">N3</option><option value="2">N2</option><option value="1">N1</option></select>
                    <button class="btn btn-primary" onclick="fetchLibraryWord()">获取词汇</button>
                    <button class="btn btn-default" onclick="fetchLibraryWord()">换一个</button>
                </div>
                <div id="lib-word-display"></div>
            </div>
        </div>
    </div>

    <div id="detail-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header"><h3>词汇详情</h3><span class="close" onclick="closeDetailModal()">&times;</span></div>
            <div id="detail-content"></div>
        </div>
    </div>

    <div id="toast" class="toast"></div>
    <div id="loading-overlay" class="loading-overlay"><div class="loading-text">正在添加...</div></div>
    <audio id="audio-player" style="display:none;"></audio>

    <script>
        const API_BASE = '';
        let cardList = [];
        let currentCardIndex = 0;
        let currentCardPage = 1;
        let totalCardPages = 1;
        let currentLibWord = null;

        // Tab switching with URL hash
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const tab = document.querySelector('[data-tab="' + tabName + '"]');
            if (tab) {
                tab.classList.add('active');
                document.getElementById(tabName + '-content').classList.add('active');
                window.location.hash = tabName;
                if (tabName === 'cards') fetchCards(1);
                else if (tabName === 'manage') searchLearning();
            }
        }

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        // Restore tab on page load
        document.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.replace('#', '');
            const validTabs = ['cards', 'manage', 'add'];
            switchTab(validTabs.includes(hash) ? hash : 'cards');
        });

        // Loading overlay
        function showLoading() { document.getElementById('loading-overlay').classList.add('active'); }
        function hideLoading() { document.getElementById('loading-overlay').classList.remove('active'); }

        function showToast(msg, type = 'success') {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.className = 'toast toast-' + type;
            t.style.display = 'block';
            setTimeout(() => t.style.display = 'none', 3000);
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function playAudio(url) {
            const player = document.getElementById('audio-player');
            player.src = url;
            player.play().catch(e => console.error('Audio play failed:', e));
        }

        // ============ Card Learning ============
        async function fetchCards(page = 1) {
            currentCardPage = page;
            const res = await fetch(API_BASE + '/api/learning/cards?page=' + page);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                cardList = data.data;
                totalCardPages = data.pagination.totalPages;
                currentCardIndex = 0;
                renderCard();
            } else {
                cardList = [];
                document.getElementById('card-area').innerHTML = '<div class="no-cards">没有未学习的词汇</div>';
                document.getElementById('card-count').textContent = '';
                document.getElementById('card-page').textContent = '';
            }
        }

        function renderCard() {
            if (cardList.length === 0) return;
            const word = cardList[currentCardIndex];
            const typeName = {1: '手动', 2: '词汇', 3: '汉字'}[word.word_type] || '?';
            const levelText = word.level ? 'N' + word.level : '-';
            document.getElementById('card-count').textContent = '第 ' + (currentCardIndex + 1) + ' 张 / 共 ' + cardList.length + ' 张';
            document.getElementById('card-page').textContent = '第 ' + currentCardPage + ' 页 / 共 ' + totalCardPages + ' 页';

            const audioUrl = word.minio_speak_url || word.speak_url || '';
            const audioHtml = audioUrl ? '<button class="audio-btn" onclick="event.stopPropagation(); playAudio(this.dataset.url)" data-url="' + escapeHtml(audioUrl) + '">▶ 播放</button>' : '-';
            const dictHtml = word.dict_url ? '<a href="' + escapeHtml(word.dict_url) + '" target="_blank" style="color:#4a90d9;" onclick="event.stopPropagation();">查看</a>' : '-';

            document.getElementById('card-area').innerHTML =
                '<div class="card-arrow ' + (currentCardIndex === 0 && currentCardPage <= 1 ? 'disabled' : '') + '" onclick="prevCard()">&#8249;</div>' +
                '<div class="card-wrapper"><div class="card" id="current-card" onclick="flipCard()">' +
                    '<div class="card-face card-front">' +
                        '<div class="card-word">' + escapeHtml(word.word) + '</div>' +
                        '<div class="card-level">' + levelText + '</div>' +
                        '<div class="card-hint">点击翻转查看详情</div>' +
                    '</div>' +
                    '<div class="card-face card-back">' +
                        '<div class="card-detail">' +
                            '<div class="row"><span class="label">单词</span><span class="value">' + escapeHtml(word.word) + '</span></div>' +
                            '<div class="row"><span class="label">读音</span><span class="value">' + escapeHtml(word.reading || '-') + '</span></div>' +
                            '<div class="row"><span class="label">类型</span><span class="value">' + typeName + '</span></div>' +
                            '<div class="row"><span class="label">等级</span><span class="value">' + levelText + '</span></div>' +
                            '<div class="row"><span class="label">词性</span><span class="value">' + escapeHtml(word.word_type_detail || '-') + '</span></div>' +
                            '<div class="row"><span class="label">释义</span><span class="value">' + escapeHtml(word.meaning_cn || '-') + '</span></div>' +
                            '<div class="row"><span class="label">例句(日)</span><span class="value">' + escapeHtml(word.example_ja || '-') + '</span></div>' +
                            '<div class="row"><span class="label">例句(中)</span><span class="value">' + escapeHtml(word.example_cn || '-') + '</span></div>' +
                            '<div class="row"><span class="label">语音</span><span class="value">' + audioHtml + '</span></div>' +
                            '<div class="row"><span class="label">百科</span><span class="value">' + dictHtml + '</span></div>' +
                        '</div>' +
                        '<div class="card-back-actions">' +
                            '<button class="btn btn-success btn-lg" onclick="event.stopPropagation(); markAsLearned(' + word.id + ')">设置为已学习</button>' +
                        '</div>' +
                    '</div>' +
                '</div></div>' +
                '<div class="card-arrow ' + (currentCardIndex >= cardList.length - 1 && currentCardPage >= totalCardPages ? 'disabled' : '') + '" onclick="nextCard()">&#8250;</div>';
        }

        function flipCard() { document.getElementById('current-card').classList.toggle('flipped'); }

        function prevCard() {
            if (currentCardIndex > 0) { currentCardIndex--; renderCard(); }
            else if (currentCardPage > 1) { fetchCards(currentCardPage - 1); }
        }

        function nextCard() {
            if (currentCardIndex < cardList.length - 1) { currentCardIndex++; renderCard(); }
            else if (currentCardPage < totalCardPages) { fetchCards(currentCardPage + 1); }
        }

        async function markAsLearned(id) {
            try {
                const res = await fetch(API_BASE + '/api/learning/' + id + '/status', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_learned: 1 })
                });
                const data = await res.json();
                if (data.success) {
                    showToast('已标记为已学习');
                    cardList.splice(currentCardIndex, 1);
                    if (cardList.length > 0) {
                        if (currentCardIndex >= cardList.length) currentCardIndex = cardList.length - 1;
                        renderCard();
                    } else { fetchCards(currentCardPage); }
                } else { showToast('操作失败', 'error'); }
            } catch (e) { showToast('操作失败: ' + e.message, 'error'); }
        }

        // ============ Learning Management ============
        let learningPage = 1;

        async function searchLearning(page = 1) {
            learningPage = page;
            const search = document.getElementById('manage-search').value;
            const status = document.getElementById('manage-status').value;
            const level = document.getElementById('manage-level').value;
            const type = document.getElementById('manage-type').value;
            const params = new URLSearchParams({ page });
            if (search) params.set('search', search);
            if (status !== '') params.set('status', status);
            if (level) params.set('level', level);
            if (type) params.set('type', type);
            const res = await fetch(API_BASE + '/api/learning/list?' + params);
            const data = await res.json();
            if (data.success) {
                const tbody = document.getElementById('learning-list');
                tbody.innerHTML = data.data.map(item => {
                    const typeName = { 1: '手动', 2: '词汇', 3: '汉字' }[item.word_type] || '?';
                    const typeClass = { 1: 'badge-manual', 2: 'badge-vocab', 3: 'badge-kanji' }[item.word_type] || '';
                    const statusBadge = item.is_learned ? '<span class="badge badge-success">已学习</span>' : '<span class="badge badge-secondary">未学习</span>';
                    return '<tr>' +
                        '<td>' + escapeHtml(item.word) + '</td>' +
                        '<td>' + escapeHtml(item.reading || '-') + '</td>' +
                        '<td class="truncate">' + escapeHtml(item.meaning_cn || '-') + '</td>' +
                        '<td>' + (item.level ? 'N' + item.level : '-') + '</td>' +
                        '<td><span class="badge ' + typeClass + '">' + typeName + '</span></td>' +
                        '<td>' + statusBadge + '</td>' +
                        '<td><button class="btn btn-primary btn-sm" onclick="showDetail(' + item.id + ')">详情</button></td>' +
                        '<td>' +
                            '<button class="btn btn-sm ' + (item.is_learned ? 'btn-warning' : 'btn-success') + '" onclick="toggleLearned(' + item.id + ',' + (item.is_learned ? 0 : 1) + ')">' + (item.is_learned ? '未学习' : '已学习') + '</button> ' +
                            '<button class="btn btn-danger btn-sm" onclick="deleteLearning(' + item.id + ')">删除</button>' +
                        '</td></tr>';
                }).join('');
                const p = data.pagination;
                let ph = '';
                if (p.page > 1) ph += '<button class="btn btn-default btn-sm" onclick="searchLearning(' + (p.page - 1) + ')">上一页</button>';
                ph += '<span style="padding:8px;color:#999;">' + p.page + '/' + p.totalPages + ' (' + p.total + ')</span>';
                if (p.page < p.totalPages) ph += '<button class="btn btn-default btn-sm" onclick="searchLearning(' + (p.page + 1) + ')">下一页</button>';
                document.getElementById('learning-pagination').innerHTML = ph;
            }
        }

        async function toggleLearned(id, status) {
            await fetch(API_BASE + '/api/learning/' + id + '/status', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_learned: status }) });
            searchLearning(learningPage);
        }

        async function deleteLearning(id) {
            if (!confirm('确定删除？')) return;
            await fetch(API_BASE + '/api/learning/' + id, { method: 'DELETE' });
            showToast('删除成功');
            searchLearning(learningPage);
        }

        async function showDetail(id) {
            const res = await fetch(API_BASE + '/api/learning/' + id);
            const data = await res.json();
            if (!data.success) return;
            const item = data.data;
            const typeName = { 1: '手动输入', 2: '词汇', 3: '汉字' }[item.word_type] || '?';
            const audioUrl = item.minio_speak_url || item.speak_url || '';
            const audioBtn = audioUrl ? '<button class="audio-btn" onclick="playAudio(this.dataset.url)" data-url="' + escapeHtml(audioUrl) + '">▶ 播放语音</button>' : '-';
            const dictLink = item.dict_url ? '<a href="' + escapeHtml(item.dict_url) + '" target="_blank" style="color:#4a90d9;">查看百科</a>' : '-';
            let html = '<table class="detail-table">';
            html += '<tr><td class="label">ID</td><td>' + item.id + '</td></tr>';
            html += '<tr><td class="label">单词</td><td>' + escapeHtml(item.word) + '</td></tr>';
            html += '<tr><td class="label">读音</td><td>' + escapeHtml(item.reading || '-') + '</td></tr>';
            html += '<tr><td class="label">类型</td><td>' + typeName + '</td></tr>';
            html += '<tr><td class="label">等级</td><td>' + (item.level ? 'N' + item.level : '-') + '</td></tr>';
            html += '<tr><td class="label">词性</td><td>' + escapeHtml(item.word_type_detail || '-') + '</td></tr>';
            html += '<tr><td class="label">释义</td><td>' + escapeHtml(item.meaning_cn || '-') + '</td></tr>';
            html += '<tr><td class="label">例句(日)</td><td>' + escapeHtml(item.example_ja || '-') + '</td></tr>';
            html += '<tr><td class="label">例句(中)</td><td>' + escapeHtml(item.example_cn || '-') + '</td></tr>';
            html += '<tr><td class="label">用法说明</td><td>' + escapeHtml(item.usage_note || '-') + '</td></tr>';
            html += '<tr><td class="label">原文语音</td><td>' + audioBtn + '</td></tr>';
            html += '<tr><td class="label">百科</td><td>' + dictLink + '</td></tr>';
            html += '<tr><td class="label">状态</td><td>' + (item.is_learned ? '<span class="badge badge-success">已学习</span>' : '<span class="badge badge-secondary">未学习</span>') + '</td></tr>';
            html += '<tr><td class="label">创建时间</td><td>' + new Date(item.created_at).toLocaleString() + '</td></tr>';
            html += '</table>';
            document.getElementById('detail-content').innerHTML = html;
            document.getElementById('detail-modal').style.display = 'block';
        }

        function closeDetailModal() { document.getElementById('detail-modal').style.display = 'none'; }

        // ============ Add Vocabulary ============
        async function manualTranslate() {
            const word = document.getElementById('manual-word').value.trim();
            if (!word) { alert('请输入单词'); return; }
            showLoading();
            try {
                const res = await fetch(API_BASE + '/api/learning/manual', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ word })
                });
                const data = await res.json();
                if (data.success) {
                    document.getElementById('manual-result').innerHTML = '<div class="msg-success">添加成功！释义: ' + escapeHtml(data.data.meaning_cn) + ' | 读音: ' + escapeHtml(data.data.reading) + '</div>';
                    document.getElementById('manual-word').value = '';
                } else {
                    document.getElementById('manual-result').innerHTML = '<div class="msg-error">添加失败: ' + (data.error || 'Unknown') + '</div>';
                }
            } catch (e) {
                document.getElementById('manual-result').innerHTML = '<div class="msg-error">添加失败: ' + e.message + '</div>';
            } finally {
                hideLoading();
            }
        }

        document.getElementById('manual-word').addEventListener('keypress', (e) => { if (e.key === 'Enter') manualTranslate(); });

        async function fetchLibraryWord() {
            const type = document.getElementById('lib-type').value;
            const level = document.getElementById('lib-level').value;
            const params = new URLSearchParams();
            if (type) params.set('type', type);
            if (level) params.set('level', level);
            const res = await fetch(API_BASE + '/api/library/random?' + params);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                currentLibWord = data.data[0];
                renderLibWord();
            } else {
                currentLibWord = null;
                document.getElementById('lib-word-display').innerHTML = '<div style="color:#999;padding:20px;">没有找到未添加的词汇</div>';
            }
        }

        function renderLibWord() {
            if (!currentLibWord) return;
            const w = currentLibWord;
            const typeName = w.word_type === 'vocab' ? '词汇' : '汉字';
            document.getElementById('lib-word-display').innerHTML =
                '<div class="lib-word-card">' +
                    '<div class="word">' + escapeHtml(w.word) + '</div>' +
                    '<div class="reading">' + escapeHtml(w.reading || '') + '</div>' +
                    '<div class="info">' + typeName + ' · N' + w.level + '</div>' +
                    '<div class="actions">' +
                        '<button class="btn btn-success" onclick="addLibWord()">添加到学习</button>' +
                        '<button class="btn btn-default" onclick="fetchLibraryWord()">换一个</button>' +
                    '</div></div>';
        }

        async function addLibWord() {
            if (!currentLibWord) return;
            showLoading();
            try {
                const res = await fetch(API_BASE + '/api/learning/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ library_id: currentLibWord.id, word: currentLibWord.word, reading: currentLibWord.reading || '', word_type: currentLibWord.word_type, level: currentLibWord.level })
                });
                const data = await res.json();
                if (data.success) {
                    showToast('添加成功！');
                    fetchLibraryWord();
                } else {
                    showToast('添加失败: ' + (data.error || 'Unknown'), 'error');
                }
            } catch (e) {
                showToast('添加失败: ' + e.message, 'error');
            } finally {
                hideLoading();
            }
        }
    </script>
</body>
</html>`;
}
