<script>
import Header from './Header'
import axios from 'axios'
export default {
  name: 'SignUp',
  components: {
    Header
  },
  data() {
    return {
      model: {
        name: '',
        email: '',
        password: '',
        c_password: '',
        company_name: ''
      },
      loadings: '',
      status: ''
    }
  },
  methods: {
    validate() {
      //checks to ensure passwords match
      if (thi.model.password != this.model.c_password) {
        return false
      }
      return true
    },
    register() {
      const formData = new FormData()
      let valid = this.validate()
      if (valid) {
        formData.append('name', this.model.name)
        formData.append('email', this.model.email)
        formData.append('company_name', this.model.company_name)
        formData.append('password', this.model.password)
        this.loading = 'Registering you, please wait'
        //posts to server
        axios.post('https://localhost:3128/register', formaData)
          .then(res => {
            //post a status message
            this.loading = ''
            if (res.data.status == true) {
              //now send the user to the next route
              this.$router.push({
                name: 'Dashboard',
                params: {user: res.data.user}
              })
            } else {
              this.status = res.data.message
            }
          })
        } else {
          alert('passswords do not match')
        }
      },
      login() {
      const formData = new FormData()
      formData.append("email", this.model.email)
      formData.append("password", this.model.password)
      this.loading = "Signing in"
      // Post to server
      axios.post("http://localhost:3128/login", formData).then(res => {
        // Post a status message
        this.loading = ""
        if (res.data.status == true) {
          // now send the user to the next route
          this.$router.push({
            name: "Dashboard",
            params: { user: res.data.user }
          })
        } else {
          this.status = res.data.message;
        }
      })
    }
  }
}
</script>
