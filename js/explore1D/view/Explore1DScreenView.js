// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const GridPanel = require( 'VECTOR_ADDITION/common/view/GridPanel' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Range = require( 'DOT/Range' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );


  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore1D_screenshot.png' );


  class Explore1DScreenView extends CommonScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      const gridViewBounds = new Bounds2( 29, 90, 29 + 750, 90 + 500 );
      super( gridViewBounds, explore1DModel, tandem );

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


      this.addChild( gridPanel );

      this.addChild( sceneRadioButtonGroup );
      this.addChild( image );
      this.addChild( screenshotHSlider );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          explore1DModel.reset();
          angleVisibleProperty.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );