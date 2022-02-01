async function gql(query, variables={}) {
    const data = await fetch('https://api.hashnode.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    return data.json();
}

const GET_USER_ARTICLES = `
    query GetUserArticles($page: Int!) {
        user(username: "alittlecoding") {
            publication {
                posts(page: $page) {
                    title
                    brief
                    slug
                    coverImage
                    totalReactions
                    dateAdded
                    dateUpdated
                    responseCount
                }
            }
        }
    }
`;

gql(GET_USER_ARTICLES, { page: 0 })
    .then(result => {
        const articles = result.data.user.publication.posts;

        $(".post-box").each(function(i){
            // console.log($(this));
            $(this).find("img").attr("src", articles[i].coverImage);
            $(this).find(".date").html("<i class='fa fa-heart-o'></i> " + articles[i].totalReactions);
            $(this).find("h4").text(articles[i].title);
            $(this).find("p").text(articles[i].brief.slice(0, 200) + "...");
            $(this).css('cursor', 'pointer');
            $(this).click(function(){
                window.open(`https://alittlecoding.com/${articles[i].slug}`, "_blank");
            });
            let postDate = articles[i].dateUpdated || articles[i].dateAdded;
            let splitedDate = postDate.slice(0, 10).split('-');
            let months = ["", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let strDate = months[Number(splitedDate[1])] + " " + splitedDate[2] + ", " + splitedDate[0];
            let ul = `<li>${strDate}.</li>
                        <li><b>${articles[i].responseCount} Comments</b></li>`
            $(this).find(".post-info ul").html(ul);
        })

});
