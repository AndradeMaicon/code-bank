import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head";
import http from "../../http";
import { Product } from "../../model";
import axios from "axios";

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({product}) => {
  return(
    <div>
      <Head>
        <title>{product.name} - Detalhes do Produto</title>
      </Head>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`R$ ${product.price}`}
        />
        <CardActions>
          <Button size="small" color="primary" component="a">Compara</Button>
        </CardActions>
        <CardMedia style={{ paddingTop: "56%" }} image={product.image_url}/>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.name}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<ProductDetailPageProps> = async (context) => {
  try {
    const {slug} = context.params!;
    const {data: product} = await http.get(`products/${slug}`)
  
    return {
      props: {
        product,
      },
      revalidate: 1 * 60 * 2,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { notFound: true };
    }
    throw err
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const {data: products} = await http.get(`products`)

  const paths = products.map((p: Product) => ({
    params: {
      slug: p.slug,
    }
  }));

  return { paths, fallback: "blocking" };
}