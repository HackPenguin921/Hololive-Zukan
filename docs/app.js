const unitFilter = document.getElementById("unitFilter");
const unitSelect = document.getElementById("unitSelect");
const unitCustomInput = document.getElementById("unitCustomInput");
const unitCustomLabel = document.getElementById("unitCustomLabel");
const memberGrid = document.getElementById("memberGrid");
const searchInput = document.getElementById("searchInput");
const registerForm = document.getElementById("registerForm");
const adminSection = document.getElementById("adminSection");
const openRegisterBtn = document.getElementById("openRegisterBtn");

let members = [];

// localStorageに保存
function saveToLocal() {
  localStorage.setItem("holomembers", JSON.stringify(members));
}

// localStorageから読み込み
function loadFromLocal() {
  const data = localStorage.getItem("holomembers");
  if (data) {
    members = JSON.parse(data);
    displayMembers();
    populateUnitFilter();
  }
}

// ユニット選択肢をユニークなものにして絞り込み用にセット
function populateUnitFilter() {
  // ここは手動でユニットリスト固定化もOK
  const predefinedUnits = [
    "0期生", "1期生", "2期生", "3期生", "4期生", "5期生",
    "ホロライブゲーマーズ", "ホロスターズ", "ホロX", "English", "ID"
  ];
  unitFilter.innerHTML = '<option value="">すべてのユニット</option>';
  predefinedUnits.forEach((u) => {
    const option = document.createElement("option");
    option.value = u;
    option.textContent = u;
    unitFilter.appendChild(option);
  });
}

// メンバーをカード形式で表示
function displayMembers() {
  memberGrid.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();
  const selectedUnit = unitFilter.value;

  const filtered = members.filter((m) => {
    return (
      (!selectedUnit || m.unit === selectedUnit) &&
      (!keyword ||
        Object.values(m).some(
          (v) => typeof v === "string" && v.toLowerCase().includes(keyword)
        ))
    );
  });

  filtered.forEach((m) => {
    const card = document.createElement("div");
    card.className = "memberCard";
    card.innerHTML = `
      <img src="${m.image || "placeholder.jpg"}" alt="${m.name}" />
      <h3>${m.name}</h3>
      <p><strong>誕生日:</strong> ${m.birthday}</p>
      <p><strong>デビュー日:</strong> ${m.debut}</p>
      <p><strong>身長:</strong> ${m.height}</p>
      <p><strong>ユニット:</strong> ${m.unit}</p>
      <p><strong>イラスト:</strong> ${m.illustrator}</p>
      <p><strong>衣装:</strong> ${m.costumeDesigner}</p>
      <p><strong>ファン名:</strong> ${m.fanName}</p>
      <p><strong>タグ:</strong> ${m.hashtag}</p>
      <p><strong>好き:</strong> ${m.likes}</p>
      <p><strong>始まりの挨拶:</strong> ${m.greetingStart || ""}</p>
      <p><strong>締めの挨拶:</strong> ${m.greetingEnd || ""}</p>
    `;
    memberGrid.appendChild(card);
  });
}

// 登録フォーム送信処理
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);

  const unit =
    formData.get("unitSelect") === "other"
      ? formData.get("unitCustom")
      : formData.get("unitSelect");

  const imageFile = formData.get("image");
  const reader = new FileReader();

  reader.onload = () => {
    const newMember = {
      name: formData.get("name"),
      birthday: formData.get("birthday"),
      debut: formData.get("debut"),
      height: formData.get("height"),
      unit,
      illustrator: formData.get("illustrator"),
      costumeDesigner: formData.get("costumeDesigner"),
      fanName: formData.get("fanName"),
      hashtag: formData.get("hashtag"),
      likes: formData.get("likes"),
      greetingStart: formData.get("greetingStart"),
      greetingEnd: formData.get("greetingEnd"),
      image: reader.result,
    };
    members.push(newMember);
    saveToLocal();
    displayMembers();
    populateUnitFilter();
    registerForm.reset();
    adminSection.style.display = "none";
  };

  if (imageFile && imageFile.size > 0) {
    reader.readAsDataURL(imageFile);
  } else {
    reader.onload();
  }
});

// ユニットが「その他」のときだけ自由入力欄を表示
unitSelect.addEventListener("change", () => {
  if (unitSelect.value === "その他") {
    unitCustomInput.style.display = "block";
    unitCustomLabel.style.display = "block";
  } else {
    unitCustomInput.style.display = "none";
    unitCustomLabel.style.display = "none";
  }
});

// 検索や絞り込みで表示更新
searchInput.addEventListener("input", displayMembers);
unitFilter.addEventListener("change", displayMembers);

// 登録画面表示のためのパスワード認証
openRegisterBtn.addEventListener("click", () => {
  const input = prompt("管理者パスワードを入力してください");
  const PASSWORD = "holoadmin2025"; // 必ず変更してください
  if (input === PASSWORD) {
    adminSection.style.display = "block";
  } else {
    alert("パスワードが違います。登録画面は表示されません。");
  }
});

// ページ読み込み時にデータロード
loadFromLocal();
