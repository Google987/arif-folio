async function gql(query, variables={}) {
    const data = await fetch('https://gql.hashnode.com/', {
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
        posts(page: $page, pageSize: 3) {
          nodes {
            title
            brief
            slug
            coverImage {
              attribution
              photographer
            }
            reactionCount
            updatedAt
            publishedAt
            responseCount
          }
        }
      }
    }
`;

function setBlogs(){
    gql(GET_USER_ARTICLES, { page: 1 })
        .then(result => {
            const articles = result.data.user.posts.nodes;

            $("#blog .post-box").each(function(i){
                // console.log($(this));
                $(this).find("img").attr("src", articles[i].coverImage.url);
                $(this).find(".date").html("<i class='fa fa-heart-o'></i> " + articles[i].reactionCount);
                $(this).find("h4").text(articles[i].title);
                $(this).find("p").text(articles[i].brief.slice(0, 200) + "...");
                $(this).css('cursor', 'pointer');
                $(this).click(function(){
                    window.open(`https://alittlecoding.com/${articles[i].slug}`, "_blank");
                });
                let postDate = articles[i].updatedAt || articles[i].publishedAt;
                let splitedDate = postDate.slice(0, 10).split('-');
                let months = ["", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                let strDate = months[Number(splitedDate[1])] + " " + splitedDate[2] + ", " + splitedDate[0];
                let ul = `<li>${strDate}.</li>
                            <li><b>${articles[i].responseCount} Comments</b></li>`
                $(this).find(".post-info ul").html(ul);
            })

    });
}


function updateIframes(){
    let iframe = document.getElementById("video1");
    iframe.src = "https://www.youtube.com/embed/S_y6kWe2u0w";
    iframe = document.getElementById("video2");
    iframe.src = "https://www.youtube.com/embed/7frtQFIytY4";
    iframe = document.getElementById("video3");
    iframe.src = "https://www.youtube.com/embed/mFNJoBGgHkA";
}

function lazyload(){
    var wt = $(window).scrollTop();    //* top of the window
    var wb = wt + $(window).height();  //* bottom of the window
 
    $("#blog").each(function(){
       var ot = $(this).offset().top - 200;  //* top of object (minus 200)
       var ob = ot + $(this).height(); //* bottom of object
 
       if(!$(this).attr("loaded") && wt<=ob && wb >= ot){
          setBlogs();
          updateIframes();
          $(this).attr("loaded",true);
       }
    });
 }

 $(document).ready(function(){
    $(window).scroll(lazyload);
    lazyload();
 });
