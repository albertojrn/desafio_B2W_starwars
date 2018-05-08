**INTRODUÇÃO**
---
Neste repositório encontra-se a proposta para a solução do desafio enviado pela empresa B2W Digital como parte do processo seletivo.<br />
A solução foi desenvolvida utilizando Node e MongoDB.<br />
A aplicação está configurada para rodar na porta 3000 (Node) e o banco de dados na porta 27017 (MongoDB).<br />
Para rodar a aplicação, executar os comandos a partir da pasta raiz da aplicação, onde encontra-se o arquivo app.js:

```
npm install
```
Para instalar o nodemon:
```
npm install nodemon -g
```
Se utilizar o nodemon:
```
nodemon app.js
```
Também está incluído no projeto testes automatizados utilizando MOCHA e CHAI.<br />
Os testes estão configurados no arquivo "/test/planetas.js".<br />
Para executar os testes, utilizar o comando:
```
npm test
```
Para executar o MongoDB, utilizar:
```
mongod
```
**DOCUMENTAÇÃO - API DE DADOS DE PLANETAS DE STAR WARS**
----

* **ENDPOINTS**

  /api/planetas<br />
  /api/planetas/:id<br />

* **MÉTODOS:**

  GET | POST | DELETE | PUT

* **PARÂMETROS DA URL:**
  * **Obrigatórios:**<br />
    id=[alfanumérico]

* **DADOS**

  * **Exemplo para POST:**
      ```
      {
        nome: 'Tatooine',
        clima: 'Arid',
        terreno: 'Dessert'
      }
      ```
  
  * **Exemplo para PUT:**
      ```
      {
        nome: 'Tatooine',
        clima: 'Arid',
        terreno: 'Dessert',
        aparicoes: 5
      }
      ```

* **Respostas:**
    
  * **Código:** 200 <br />
    * **Exemplo POST (/api/planetas)**<br />
      **Conteúdo:** 
      ```
      { 
        message: 'Planeta adicionado com sucesso!',
        planeta: {
          _id : 5af0d0a63b0e6922807ba2ca,
          nome: 'Tatooine',
          clima: 'Arid',
          terreno: 'Dessert',
          aparicoes: 5,
          __v: 0 
        }
      }
      ```
      ou
      ```
      { message: 'Os 3 campos são obrigatórios.' }
      ```
      ou
      ```
      { message: 'O planeta já existe no banco de dados.' }
      ```
    
    * **Exemplo GET (/api/planetas)**<br />
      **Conteúdo:**
      ```
      [
        {
          _id : 5af0d0a63b0e6922807ba2ca,
          nome: 'Tatooine',
          clima: 'Arid',
          terreno: 'Dessert',
          aparicoes: 5,
          __v: 0
        },
        {
          _id : 5af0d0be3b0e6922807ba2cc,
          nome: 'Alderaan',
          clima: 'temperate',
          terreno: 'grasslands, mountains',
          aparicoes: 2,
          __v: 0
        }
      ]
      ```
    
    * **Exemplo GET (/api/planetas/:id)**<br />
      **Conteúdo:**
      ```
      {
        _id : 5af0d0a63b0e6922807ba2ca,
        nome: 'Tatooine',
        clima: 'Arid',
        terreno: 'Dessert',
        aparicoes: 5,
        __v: 0
      }
      ```
        
     * **Exemplo PUT (/api/planetas/:id)**<br />
       **Conteúdo:**
       ```
        { message: 'Planeta atualizado!', 
          planeta: {
            _id : 5af0d0a63b0e6922807ba2ca,
            nome: 'Tatooine',
            clima: 'Arid',
            terreno: 'Dessert',
            aparicoes: 5,
            __v: 0
          }
        }
        ```
        ou
        ```      
        { message: 'Os 3 campos são obrigatórios.' }
        ```
        ou
        ```       
        { message: 'O planeta já existe no banco de dados.' }
        ```
    
      * **Exemplo DELETE (/api/planetas/:id)**<br />
        **Conteúdo:**
        ```
        {
          message: "Planeta excluído.",
          result: {
           "n": 1,
           "ok": 1
         }
        }
        ```
  * **Código:** 500 <br />
    Retornado quando houver algum erro, como uma consulta ao banco de dados ou inserir uma nova entrada no banco de dados.<br />
    Um objeto contendo informações sobre o erro é retornado.<br />
    
* **Exemplos de Chamadas**
    ```
    $.ajax({
      url: "/api/planetas",
      dataType: "json",
      data: {
        nome: 'Tatooine',
        clima: 'Arid',
        terreno: 'Dessert'
      },
      type: "POST",
      success: function(r) {
        console.log(r);
      }
    });
    ```
    ```
    $.ajax({
      url: "/api/planetas",
      dataType: "json",
      type: "GET",
      success: function(r) {
        console.log(r);
      }
    });
    ```
    ```
    $.ajax({
      url: "/api/planetas/5af0d0a63b0e6922807ba2ca",
      dataType: "json",
      type: "GET",
      success: function(r) {
        console.log(r);
      }
    });
    ```
    ```
    $.ajax({
      url: "/api/planetas",
      dataType: "json",
      data: {
        nome: 'Tatooine',
        clima: 'Arid',
        terreno: 'Dessert',
        aparicoes: 5
      },
      type: "PUT",
      success: function(r) {
        console.log(r);
      }
    });
    ```
    ```
    $.ajax({
      url: "/api/planetas/5af0d0a63b0e6922807ba2ca",
      dataType: "json",
      type: "DELETE",
      success: function(r) {
        console.log(r);
      }
    });
    ```

* **Notas:**

  * **Campos de busca:** <br />
    **nome**<br />
    Faz a busca pelo nome do planeta<br />
    Exemplo:
    ```
    /api/planetas/?nome=Tatooine
    ```
    Retorno:
    ```
    [
      {
        _id : 5af0d0be3b0e6922807ba2cc,
        nome: 'Alderaan',
        clima: 'temperate',
        terreno: 'grasslands, mountains',
        aparicoes: 2,
        __v: 0
      }
    ]
    ```
