// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const Explore1DVectorCreatorPanels = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanels' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class Explore1DScreenView extends CommonScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super( explore1DModel, tandem, _, {
        vectorTypes: [ VectorAdditionConstants.VECTOR_TYPES.ONE, VectorAdditionConstants.VECTOR_TYPES.TWO ]
      } );

      // function to the sceneNode based on orientation
      const getSceneNode = ( orientation ) => {
        for ( let i = 0; i < explore1DModel.scenes.length; i++ ) {

          const sceneModel = explore1DModel.getScene( orientation );
          if ( this.sceneNodes[ i ].scene === sceneModel ) {
            return this.sceneNodes[ i ];
          }
        }
      };

      // convenience variables for the scenes and the scene nodes
      const horizontalScene = explore1DModel.getScene( VectorOrientations.HORIZONTAL );
      const verticalScene = explore1DModel.getScene( VectorOrientations.VERTICAL );

      const horizontalSceneNode = getSceneNode( VectorOrientations.HORIZONTAL );
      const verticalSceneNode = getSceneNode( VectorOrientations.VERTICAL );


      // create the creator panel for each scene
      const explore1DVectorCreatorPanels = new Explore1DVectorCreatorPanels(
        horizontalScene.vectorSets[ 0 ].vectors, //TODO: find a better way than index 0, we can index 0 right now since there is only 1 vector set per scene for 1d
        horizontalScene.graph.modelViewTransformProperty,
        verticalScene.vectorSets[ 0 ].vectors,
        verticalScene.graph.modelViewTransformProperty );

      // create the vector panels
      const horizontalVectorCreatorPanel = explore1DVectorCreatorPanels.horizontalVectorCreatorPanel;
      const verticalVectorCreatorPanel = explore1DVectorCreatorPanels.verticalVectorCreatorPanel;

      
      explore1DModel.vectorOrientationProperty.link( ( vectorOrientation ) => {
        switch( vectorOrientation ) {
          case VectorOrientations.HORIZONTAL:
            verticalSceneNode.visible = false;
            verticalVectorCreatorPanel.visible = false;
            horizontalSceneNode.visible = true;
            horizontalVectorCreatorPanel.visible = true;
            break;
          case VectorOrientations.VERTICAL:
            verticalSceneNode.visible = true;
            verticalVectorCreatorPanel.visible = true;
            horizontalVectorCreatorPanel.visible = false;
            horizontalSceneNode.visible = false;
            break;
          case VectorOrientations.TWO_DIMENSIONAL:
            throw new Error( `Explore1D does not support vector orientation: ${vectorOrientation}` );
          default:
          console.log( vectorOrientation );
            throw new Error( `Vector orientation not handled: ${vectorOrientation}` );
        }
      } );

      // TODO:: find better way to deal with absence of angle
      const angleVisibleProperty = new BooleanProperty( false );

      const graphControlPanel = new GraphControlPanel( explore1DModel.sumVisibleProperty,
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
        value: VectorOrientations.HORIZONTAL,
        node: new ArrowNode( 0, 0, 40, 0, ArrowNodeOptions )
      }, {
        value: VectorOrientations.VERTICAL,
        node: new ArrowNode( 0, 0, 0, 40, ArrowNodeOptions )
      } ];

      const sceneRadioButtonGroup = new RadioButtonGroup( explore1DModel.vectorOrientationProperty, sceneRadioButtonContent, {
        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2,
        right: this.layoutBounds.maxX - 4,
        top: graphControlPanel.bottom + 10,
        orientation: 'horizontal'
      } );

      this.addChild( horizontalVectorCreatorPanel);
      this.addChild( verticalVectorCreatorPanel );
      this.addChild( graphControlPanel );
      this.addChild( sceneRadioButtonGroup );

    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );