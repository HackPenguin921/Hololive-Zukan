const unitFilter = document.getElementById("unitFilter");
const memberList = document.getElementById("memberList");
const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const closeModalBtn = document.getElementById("closeModalBtn");
const deleteMemberBtn = document.getElementById("deleteMemberBtn");
const searchInput = document.getElementById("searchInput");
const openRegisterBtn = document.getElementById("openRegisterBtn");
const adminSection = document.getElementById("adminSection");

let members = [];
let currentMemberIndex = null;

// 事前決められたユニットリスト（登録フォーム用など）
const predefinedUnits = [
  "0期生", "1期生", "2期生", "3期生", "4期生", "5期生",
  "ホロライブゲーマーズ", "ホロスターズ", "ホロX", "English", "ID"
];

// localStorageに保存
function saveToLocal() {
  localStorage.setItem("holomembers", JSON.stringify(members));
}

// localStorageから読み込み
function loadFromLocal() {
  const data = localStorage.getItem("holomembers");
  if (data) {
    members = JSON.parse(data);
  }
  displayMembers();
  populateUnitFilter();
}

// ユニットフィルターの選択肢セット
function populateUnitFilter() {
  unitFilter.innerHTML = '<option value="">すべてのユニット</option>';
  predefinedUnits.forEach((u) => {
    const option = document.createElement("option");
    option.value = u;
    option.textContent = u;
    unitFilter.appendChild(option);
  });
}

// メンバー名前一覧表示
function displayMembers() {
  memberList.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();
  const selectedUnit = unitFilter.value;

  const filtered = members.filter(m => {
    return (!selectedUnit || m.unit === selectedUnit) &&
      (!keyword || Object.values(m).some(v => typeof v === "string" && v.toLowerCase().includes(keyword)));
  });

  if(filtered.length === 0) {
    memberList.innerHTML = '<p style="text-align:center; color:#666;">該当するメンバーがいません</p>';
    return;
  }

  filtered.forEach((m) => {
    const div = document.createElement("div");
    div.className = "memberNameItem";
    div.textContent = m.name;
    div.addEventListener("click", () => {
      currentMemberIndex = members.indexOf(m);
      showMemberDetail(m);
    });
    memberList.appendChild(div);
  });
}

// メンバー詳細表示
function showMemberDetail(member) {
  detailContent.innerHTML = `
    <img src="${member.image || "placeholder.jpg"}" alt="${member.name}" />
    <h2>${member.name}</h2>
    <p><strong>誕生日（月日）:</strong> ${member.birthday}</p>
    <p><strong>デビュー日:</strong> ${member.debut}</p>
    <p><strong>身長:</strong> ${member.height} cm</p>
    <p><strong>ユニット:</strong> ${member.unit}</p>
    <p><strong>イラスト:</strong> ${member.illustrator}</p>
    <p><strong>衣装:</strong> ${member.costumeDesigner}</p>
    <p><strong>ファン名:</strong> ${member.fanName}</p>
    <p><strong>タグ:</strong> ${member.hashtag}</p>
    <p><strong>好き:</strong> ${member.likes}</p>
    <p><strong>始まりの挨拶:</strong> ${member.greetingStart || ""}</p>
    <p><strong>締めの挨拶:</strong> ${member.greetingEnd || ""}</p>
  `;
  detailModal.style.display = "flex";
}

// モーダル閉じる
closeModalBtn.addEventListener("click", () => {
  detailModal.style.display = "none";
  currentMemberIndex = null;
});

// メンバー削除
deleteMemberBtn.addEventListener("click", () => {
  if (currentMemberIndex === null) return;

  if (confirm("本当にこのメンバーを削除しますか？")) {
    members.splice(currentMemberIndex, 1);
    saveToLocal();
    displayMembers();
    detailModal.style.display = "none";
    currentMemberIndex = null;
  }
});

// 検索やユニットフィルター連動
searchInput.addEventListener("input", displayMembers);
unitFilter.addEventListener("change", displayMembers);

// 管理者用登録画面ボタン（パスワード認証）
openRegisterBtn.addEventListener("click", () => {
  const input = prompt("管理者パスワードを入力してください");
  const PASSWORD = "holoadmin2025"; // 適宜変更してください
  if (input === PASSWORD) {
    adminSection.style.display = "block";
  } else {
    alert("パスワードが違います。登録画面は表示されません。");
  }
});

// 初期ロード
loadFromLocal();
