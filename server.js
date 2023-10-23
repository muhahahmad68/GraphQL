const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID} = require('graphql')
const _ = require('lodash')

const app = express()

const books = [
    {id: '1', title: 'Name of the Wind', author: 'Muhammad'},
    {id: '2', title: 'The Catcher', author: 'Abdullah'},
    {id: '3', title: 'Overall Best', author: 'Khadeejah'},
]

const BookType = new GraphQLObjectType(
    {
        name: 'Book',
        fields: () => ({
            id: {type: GraphQLID},
            title: {type: GraphQLString},
            author: {type: GraphQLString},
        })
    });

    const RootQuery = new GraphQLObjectType({
        name: 'Query',
        fields: {
            books: {
                type: new GraphQLList(BookType),
                resolve(parent, args){
                    return books
                }
            },
            allBooks: {
                type: new GraphQLList(BookType),
                resolve(parent, args){
                    return books
                }
            },
            booksByTitle: {
                type: new GraphQLList(BookType),
                args: {title: {type: GraphQLString}},
                resolve(parent, args){
                    return _.filter(books, {title: args.title})
                }
            },
            booksByAuthor: {
                type: new GraphQLList(BookType),
                args: {author: {type: GraphQLString}},
                resolve(parent, args){
                    return _.filter(books, {author: args.author})
                }
            },
            booksById: {
                type: BookType,
                args: {id: {type: GraphQLID}},
                resolve(parent, args){
                    return _.find(books, {id: args.id})
                }
            },
            booksByTitleAndAuthor: {
                type: new GraphQLList(BookType),
                args: {
                    title: {type: GraphQLString}, author: {type: GraphQLString}},
                resolve(parent, args){
                    return _.filter(books, {title: args.title, author: args.author})
                    }
                },
            }});


const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                title: {type: GraphQLString},author: {type: GraphQLString}},
            resolve(parent, args){
                const book = {id: books.length + 1, title: args.title, author: args.author}
                books.push(book);
                return book;
            }
        },
        deleteBook: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // const book = _.find(books, {id: args.id})
                book =  _.remove(books, (book) => book.id === args.id)[0];
                return book;
            }
        },
    }});

    const schema = new GraphQLSchema({
        query: RootQuery,
        mutation: RootMutation
    });

    app.use('/graphql', graphqlHTTP({schema, graphiql: true}));
    app.listen(5000, () => console.log('Server Running'));
