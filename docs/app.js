const PASSWORD = "holoadmin2025";
let currentEditIndex = null;

const viewBtn = document.getElementById("viewBtn");
const registerBtn = document.getElementById("registerBtn");
const passwordSection = document.getElementById("passwordSection");
const passwordInput = document.getElementById("adminPassword");
const confirmPasswordBtn = document.getElementById("confirmPasswordBtn");
const passwordError = document.getElementById("passwordError");

const registerSection = document.getElementById("registerSection");
const viewSection = document.getElementById("viewSection");
const memberForm = document.getElementById("memberForm");
const memberList = document.getElementById("memberList");
const membersContainer = document.getElementById("members");
const deleteBtn = document.getElementById("deleteBtn");

const searchInput = document.getElementById("searchInput");
const unitFilter = document.getElementById("unitFilter");
const unitSelect = document.getElementById("unit");
const customUnit = document.getElementById("customUnit");

let members = JSON.parse(localStorage.getItem("hololive_members")) || [];

viewBtn.addEventListener("click", () => {
  registerSection.style.display = "none";
  passwordSection.style.display = "none";
  viewSection.style.display = "block";
  displayMembers();
});

registerBtn.addEventListener("click", () => {
  viewSection.style.display = "none";
  passwordSection.style.display = "block";
  registerSection.style.display = "none";
});

confirmPasswordBtn.addEventListener("click", () => {
  if (passwordInput.value === PASSWORD) {
    passwordSection.style.display = "none";
    registerSection.style.display = "block";
    passwordError.textContent = "";
    showMemberList();
  } else {
    passwordError.textContent = "パスワードが間違っています。";
  }
});

unitSelect.addEventListener("change", () => {
  customUnit.style.display = unitSelect.value === "その他" ? "block" : "none";
});

memberForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const unitValue = unitSelect.value === "その他" ? customUnit.value : unitSelect.value;

  const member = {
    name: document.getElementById("name").value,
    image: document.getElementById("image").value,
    birthday: document.getElementById("birthday").value,
    debut: document.getElementById("debut").value,
    height: document.getElementById("height").value,
    unit: unitValue,
    illustrator: document.getElementById("illustrator").value,
    designer: document.getElementById("designer").value,
    fanName: document.getElementById("fanName").value,
    hashtag: document.getElementById("hashtag").value,
    likes: document.getElementById("likes").value,
    greetStart: document.getElementById("greetStart").value,
    greetEnd: document.getElementById("greetEnd").value,
  };

  if (currentEditIndex !== null) {
    members[currentEditIndex] = member;
  } else {
    members.push(member);
  }

  localStorage.setItem("hololive_members", JSON.stringify(members));
  memberForm.reset();
  currentEditIndex = null;
  deleteBtn.style.display = "none";
  showMemberList();
});

deleteBtn.addEventListener("click", () => {
  if (currentEditIndex !== null && confirm("本当に削除しますか？")) {
    members.splice(currentEditIndex, 1);
    localStorage.setItem("hololive_members", JSON.stringify(members));
    memberForm.reset();
    currentEditIndex = null;
    deleteBtn.style.display = "none";
    showMemberList();
  }
});

function showMemberList() {
  memberList.innerHTML = "";
  members.forEach((member, index) => {
    const btn = document.createElement("button");
    btn.textContent = member.name;
    btn.addEventListener("click", () => editMember(index));
    memberList.appendChild(btn);
  });
}

function editMember(index) {
  const member = members[index];
  document.getElementById("name").value = member.name;
  document.getElementById("image").value = member.image;
  document.getElementById("birthday").value = member.birthday;
  document.getElementById("debut").value = member.debut;
  document.getElementById("height").value = member.height;
  document.getElementById("unit").value = member.unit;
  document.getElementById("illustrator").value = member.illustrator;
  document.getElementById("designer").value = member.designer;
  document.getElementById("fanName").value = member.fanName;
  document.getElementById("hashtag").value = member.hashtag;
  document.getElementById("likes").value = member.likes;
  document.getElementById("greetStart").value = member.greetStart;
  document.getElementById("greetEnd").value = member.greetEnd;

  currentEditIndex = index;
  deleteBtn.style.display = "inline-block";
}

function displayMembers() {
  const keyword = searchInput.value.toLowerCase();
  const selectedUnit = unitFilter.value;
  membersContainer.innerHTML = "";

  const filtered = members.filter(m => {
    const matchKeyword = Object.values(m).some(val =>
      String(val).toLowerCase().includes(keyword)
    );
    const matchUnit = !selectedUnit || m.unit === selectedUnit;
    return matchKeyword && matchUnit;
  });

  filtered.forEach(member => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `<p class="member-name">${member.name}</p>`;
    card.addEventListener("click", () => showDetail(member));
    membersContainer.appendChild(card);
  });
}

function showDetail(member) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">×</span>
      <h2>${member.name}</h2>
      <img src="${member.image}" alt="${member.name}" />
      <p>誕生日: ${member.birthday}</p>
      <p>デビュー日: ${member.debut}</p>
      <p>身長: ${member.height}</p>
      <p>ユニット: ${member.unit}</p>
      <p>イラストレーター: ${member.illustrator}</p>
      <p>新衣装デザイン: ${member.designer}</p>
      <p>ファンネーム: ${member.fanName}</p>
      <p>ハッシュタグ: ${member.hashtag}</p>
      <p>好きなもの: ${member.likes}</p>
      <p>挨拶（始まり）: ${member.greetStart}</p>
      <p>挨拶（締め）: ${member.greetEnd}</p>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector(".close").addEventListener("click", () => modal.remove());
}

searchInput.addEventListener("input", displayMembers);
unitFilter.addEventListener("change", displayMembers);
