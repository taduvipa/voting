<template>
  <div class="main-bg">
    <div class="card">
      <h2 class="title">🎮 Pemilihan Nama Grup</h2>
      <form @submit.prevent="tambahNama" class="form-row">
        <input v-model="namaBaru" class="input" placeholder="Masukkan nama grup" />
        <button type="submit" class="btn-add">Tambah</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
      <hr class="divider" />
      <div>
        <label class="label">Pilih nama grup untuk voting:</label>
        <select v-model="namaDipilih" class="select">
          <option disabled value="">-- Pilih Nama --</option>
          <option v-for="n in daftarNama" :key="n" :value="n">{{ n }}</option>
        </select>
        <button :disabled="!namaDipilih" class="btn-vote" @click="vote">Vote</button>
      </div>
      <div v-if="voteMsg" class="vote-msg">{{ voteMsg }}</div>
      <hr class="divider" />
      <div>
        <label class="label">Hasil Voting:</label>
        <div v-if="loadingVote" style="color:#bae6fd;">Memuat...</div>
        <div v-else>
          <div v-if="!hasVoteResult" style="color:#64748b;font-style:italic;">belum ada voting berlangsung</div>
          <ul v-else class="vote-list">
            <li v-for="(jumlah, nama) in hasilVoting" :key="nama">
              <span class="vote-nama">{{ nama }}</span>
              <span class="vote-jumlah">{{ jumlah }} vote</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      namaBaru: '',
      daftarNama: [],
      namaDipilih: '',
      error: '',
      voteMsg: '',
      hasilVoting: {},
      loadingVote: false
    }
  },
  computed: {
    hasVoteResult() {
      return Object.keys(this.hasilVoting).length > 0;
    }
  },
  methods: {
    async fetchNama() {
      const res = await fetch('http://localhost:3001/api/nama');
      this.daftarNama = await res.json();
    },
    async fetchVoting() {
      this.loadingVote = true;
      try {
        const res = await fetch('http://localhost:3001/api/vote');
        this.hasilVoting = await res.json();
      } catch {
        this.hasilVoting = {};
      }
      this.loadingVote = false;
    },
    async tambahNama() {
      this.error = '';
      if (!this.namaBaru.trim()) {
        this.error = 'Nama tidak boleh kosong';
        return;
      }
      const res = await fetch('http://localhost:3001/api/nama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: this.namaBaru })
      });
      if (res.ok) {
        this.namaBaru = '';
        await this.fetchNama();
      } else {
        const data = await res.json();
        this.error = data.error || 'Gagal menambah nama';
      }
    },
    async vote() {
      if (!this.namaDipilih) return;
      const res = await fetch('http://localhost:3001/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: this.namaDipilih })
      });
      if (res.ok) {
        this.voteMsg = `🎉 Vote untuk "${this.namaDipilih}" tercatat!`;
        await this.fetchVoting();
      } else {
        this.voteMsg = 'Vote gagal!';
      }
      setTimeout(() => this.voteMsg = '', 2000);
    }
  },
  mounted() {
    this.fetchNama();
    this.fetchVoting();
  }
}
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
}
.card {
  background: rgba(30, 41, 59, 0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 2.2em 1.5em 1.5em 1.5em;
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 2px solid #0ea5e9;
}
.title {
  color: #fff;
  text-align: center;
  margin-bottom: 1.2em;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 1.5em;
  text-shadow: 0 2px 8px #0ea5e9;
}
.form-row {
  display: flex;
  gap: 0.5em;
  margin-bottom: 0.5em;
}
.input {
  flex: 1;
  padding: 0.7em 1em;
  border-radius: 8px;
  border: none;
  background: #334155;
  color: #fff;
  font-size: 1em;
  outline: none;
  transition: background 0.2s;
}
.input:focus {
  background: #475569;
}
.btn-add {
  background: linear-gradient(90deg, #0ea5e9 60%, #38bdf8 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7em 1.1em;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0 2px 8px #0ea5e9aa;
  transition: background 0.2s, transform 0.1s;
}
.btn-add:hover {
  background: linear-gradient(90deg, #38bdf8 60%, #0ea5e9 100%);
  transform: scale(1.05);
}
.error {
  color: #f87171;
  margin-bottom: 0.5em;
  text-align: center;
  font-weight: 500;
}
.divider {
  border: none;
  border-top: 1.5px solid #334155;
  margin: 1.2em 0 1em 0;
}
.label {
  color: #bae6fd;
  font-size: 1em;
  margin-bottom: 0.4em;
  display: block;
  font-weight: 600;
}
.select {
  width: 100%;
  padding: 0.7em 1em;
  border-radius: 8px;
  border: none;
  background: #334155;
  color: #fff;
  font-size: 1em;
  margin-bottom: 0.7em;
  outline: none;
  transition: background 0.2s;
}
.select:focus {
  background: #475569;
}
.btn-vote {
  width: 100%;
  background: linear-gradient(90deg, #fbbf24 60%, #f59e42 100%);
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.7em 0;
  font-weight: 700;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 2px 8px #fbbf24aa;
  transition: background 0.2s, transform 0.1s;
  margin-bottom: 0.5em;
}
.btn-vote:disabled {
  background: #64748b;
  color: #fff;
  cursor: not-allowed;
  box-shadow: none;
}
.btn-vote:not(:disabled):hover {
  background: linear-gradient(90deg, #f59e42 60%, #fbbf24 100%);
  transform: scale(1.03);
}
.vote-msg {
  color: #fbbf24;
  background: #222a;
  border-radius: 8px;
  padding: 0.7em 1em;
  text-align: center;
  margin-top: 0.7em;
  font-weight: 600;
  font-size: 1.05em;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px #fbbf24aa;
}
.vote-list {
  list-style: none;
  padding: 0;
  margin: 0.5em 0 0 0;
}
.vote-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #334155;
  color: #fff;
  border-radius: 7px;
  margin-bottom: 0.4em;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: 500;
  box-shadow: 0 1px 4px #0ea5e933;
}
.vote-nama {
  color: #bae6fd;
}
.vote-jumlah {
  color: #fbbf24;
  font-weight: 700;
}
@media (max-width: 480px) {
  .card {
    padding: 1.2em 0.5em 1em 0.5em;
    max-width: 98vw;
  }
  .title {
    font-size: 1.1em;
  }
}
</style>
