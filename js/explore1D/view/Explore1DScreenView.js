// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Explore1DVectorPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorPanel' );
  const GridPanel = require( 'VECTOR_ADDITION/common/view/GridPanel' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Range = require( 'DOT/Range' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore1D_screenshot.png' );


  class Explore1DScreenView extends ScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super();

      const horizontalScene = new SceneNode( explore1DModel, explore1DModel.horizontalGraph );
      const verticalScene = new SceneNode( explore1DModel, explore1DModel.verticalGraph );
      

      // create the vector panels
      const horizontalVectorPanel = new Explore1DVectorPanel( 
        explore1DModel.horizontalGraph.vectors,
        explore1DModel.horizontalGraph.modelViewTransformProperty 
      );
      const verticalVectorPanel = new Explore1DVectorPanel( 
        explore1DModel.verticalGraph.vectors,
        explore1DModel.verticalGraph.modelViewTransformProperty 
      );


      explore1DModel.vectorOrientationProperty.link( ( vectorOrientation ) => {
        switch( vectorOrientation ) {
          case VectorOrientation.HORIZONTAL:
            verticalScene.visible = false;
            verticalVectorPanel.visible = false;
            horizontalScene.visible = true;
            horizontalVectorPanel.visible = true;
            break;
          case VectorOrientation.VERTICAL:
            verticalScene.visible = true;
            verticalVectorPanel.visible = true;
            horizontalVectorPanel.visible = false;
            horizontalScene.visible = false;
            break;
          case VectorOrientation.ALL:
            throw new Error( 'explore1D cannot support all vector orientation' );
          default:
            throw new Error( 'Vector orientation not handled', vectorOrientation );
        }
      } );


      // Show the mock-up and a slider to change its transparency
      const mockupOpacityProperty = new NumberProperty( 0.0 );
      const image = new Image( mockupImage, { pickable: false, scale: 0.67, top: 0, left: 0 } );

      const screenshotHSlider = new HSlider( mockupOpacityProperty, new Range( 0, 1 ), { top: 0, left: 0 } );
      mockupOpacityProperty.linkAttribute( image, 'opacity' );

      // TODO:: find better way to deal with absence of angle
      const angleVisibleProperty = new BooleanProperty( false );

      const gridPanel = new GridPanel( explore1DModel.sumVisibleProperty,
        explore1DModel.valuesVisibleProperty,
        angleVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.componentStyleProperty, {
          right: this.layoutBounds.maxX - 4,
          top: 10
        } );

      const ArrowNodeOptions = { fill: 'black', doubleHead: true, tailWidth: 3, headWidth: 8, headHeight: 10 };
      // Scene radio buttons
      const sceneRadioButtonContent = [ {
        value: VectorOrientation.HORIZONTAL,
        node: new ArrowNode( 0, 0, 40, 0, ArrowNodeOptions )
      }, {
        value: VectorOrientation.VERTICAL,
        node: new ArrowNode( 0, 0, 0, 40, ArrowNodeOptions )
      } ];

      const sceneRadioButtonGroup = new RadioButtonGroup( explore1DModel.vectorOrientationProperty, sceneRadioButtonContent, {
        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2,
        right: this.layoutBounds.maxX - 4,
        top: gridPanel.bottom + 10,
        orientation: 'horizontal'
      } );



      this.setChildren([ 
        horizontalScene, 
        verticalScene,
        horizontalVectorPanel,
        verticalVectorPanel,
        gridPanel,
        sceneRadioButtonGroup,
        image,
        screenshotHSlider ]);
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );