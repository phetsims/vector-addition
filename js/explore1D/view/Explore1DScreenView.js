// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore1D_screenshot.png' );

  // constants
  const modelBounds = new Bounds2( 0, 0, 60, 40 );
  const viewBounds = new Bounds2( 29, 90, 29 + 764, 90 + 500 );

//  const viewBounds = new Bounds2( 29, 90, 29+750, 90+500 );

  class Explore1DScreenView extends ScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super();

      const modelViewTransform = new ModelViewTransform2.createRectangleInvertedYMapping( modelBounds, viewBounds );

      // Show the mock-up and a slider to change its transparency
      const mockupOpacityProperty = new NumberProperty( 0.0 );
      const image = new Image( mockupImage, { pickable: false, scale: 0.67, top: 0, left: 0 } );

      const screenshotHSlider = new HSlider( mockupOpacityProperty, new Range( 0, 1 ), { top: 0, left: 0 } );
      mockupOpacityProperty.linkAttribute( image, 'opacity' );

      const graphNode = new GraphNode( modelViewTransform );

      this.addChild( graphNode );
      this.addChild( image );
      this.addChild( screenshotHSlider );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          explore1DModel.reset();
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