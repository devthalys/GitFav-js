import { GithubUser } from "./GithubUser.js";
// classe que vai conter a logica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    // GithubUser.search('Thalys001').then(user => console.log(user));
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem
      ('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username);
      if (userExists) {
        throw new Error('User already registered');
      }

      const user = await GithubUser.search(username)
      console.log(user, 'usr');
      if (user.login === undefined) {
        throw new Error('User not found')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update();
    this.save();
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector('.search button');
    const inputField = this.root.querySelector('.search input');

    const addUsername = () => {
      const { value } = inputField;
      this.add(value);
    };

    addButton.onclick = addUsername;

    inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        addUsername();
      }
    });
  }

  update() {
    this.removeAllTr();

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `image of ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.bio').textContent = user.bio


      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Are you sure you want to remove?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
    console.log(this.entries, 'entries');
  }

  createRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/Thalys001.png"
        alt="image of Thalys001"
      />
      <a href="https://github.com/Thalys001" target="_blank">
        <p>Thalys Leite</p>
        <span>Thalys001</span>
      </a>
    </td>
    <td class="repositories">30</td>
    <td class="followers">2</td>
    <td class="bio">1</td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}