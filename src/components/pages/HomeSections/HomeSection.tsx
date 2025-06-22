import scss from './HomeSection.module.scss'

const HomeSection = () => {
  return (
    <section className={scss.HomeSection}>
      <div className="container">
        <div className={scss.content}>
          <h1>HomeSection</h1>
        </div>
      </div>
    </section>
  )
}

export default HomeSection